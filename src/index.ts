import * as dotenv from "dotenv";

module CartManager {
    dotenv.config();
    export interface IStorageItem {
        id: string;
        sku: string;
        name: string;
        price: string;
        oldPrice: string;
        quantity: number;
    }

    export class LocalStorageWorker {
        localStorageSupported: boolean;

        constructor() {
            this.localStorageSupported = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;
        }

        // add value to storage
        addItem(id: string, sku: string, name: string, price: string, oldPrice: string, quantity: number) {
            const item: IStorageItem = {
                id:id,
                sku:sku,
                name:name,
                price: price,
                oldPrice: oldPrice,
                quantity: quantity
            }

            if (this.localStorageSupported) {
                localStorage.setItem(id, JSON.stringify(item));
            }
        }


        // count values from storage

        countItems() {
            return localStorage.length
        }

        // sum all items(Qty*price)
        sumItems(){
            let sum = 0

            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.id(i);
                var data = JSON.parse(localStorage.getItem(key) || '{}')
                sum += data.quantity * data.price

            }

            return sum
        }


        savingItems(){
            let sum = 0
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.id(i);
                var data = JSON.parse(localStorage.getItem(key) || '{}')
                sum += data.quantity * data.oldPrice

            }

            return sum
        }


        // get all values from storage (all items)
        getAllItems(){
            var list = new Array();

            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.id(i);
                var value = localStorage.getItem(key);

                list.push(({
                    key: key,
                    value: value
                }));
            }

            return list;
        }

        // remove value from storage
        remove(key: string) {
            if (this.localStorageSupported) {
                localStorage.removeItem(key);
            }
        }

        // clear storage (remove all items from it)
        clear() {
            if (this.localStorageSupported) {
                localStorage.clear();
            }
        }

        // submit to the checkout microservice
        async checkout(){
            const baseUrl = process.env.baseUrl || 'localhost:3000/'
            const content = this.getAllItems() || null
            const response =  await fetch(baseUrl, {
                method: 'POST',
                body: JSON.stringify(content),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} });
              
              if (!response.ok) { }

              if (response.body !== null) {}
            return response
        }



    }


} 