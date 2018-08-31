
//export module Fxp.Common {
//    export abstract class StoreBase extends EventEmitter {
//        //private _data: any;

//        constructor() {
//            super();
//        }

//        //Returns entire collection of records which the store manages. 
//        public getAll(): any {
//            return this.getData();
//        }

//        //Get specific record which store is managing. 
//        public getById(id: any): any {
//            return this.getDataById(id);
//        }

//        //Fires events for any change in the data. 
//        protected emitChange() {
//            this.emitChange();
//        }

//        /**
//         * @param {function} callback
//         * Subscribes the callback for data change. 
//         */
//        public addChangeListener(callback): void {
//            this.addChangeListener(callback);
//        }

//        /**
//         * @param {function} callback
//         * Unsubscribes the callback for data change.
//         */
//        public removeChangeListener(callback) {
//            this.removeChangeListener(callback);
//        }

//        //Implement this method to return the entire collection of data. 
//        abstract getData(): any;

//        //Implement this method to create a new record using the payload. 
//        abstract createData(payload: any): any;

//        //Implement this method to delete a particular record using the payload.
//        abstract deleteData(payload: any): any;

//        //Implement this method to update a particular record using the payload.
//        abstract updateData(payload: any): any;

//        //Implement this method to search and return a record by Id. 
//        abstract getDataById(id: any): any;

//        // Main event dispatch function for the store. 
//        public dispatcherIndex(): void {
//            var dispatcher = Fxp.Dispatchers.Dispatcher.getCurrentInstance();
//            dispatcher.register(function (payload: any): any {
//                var action = payload.action;
//                var text;

//                switch (action.actionType) {
//                    case "CREATE":
//                        text = action.text.trim();
//                        if (text !== '') {
//                            this.createData(payload);
//                            this.emitChange();
//                        }
//                        break;

//                    case "DELETE":
//                        this.deleteData(payload);
//                        this.emitChange();
//                        break;

//                    case "UPDATE":
//                        this.updateData(payload);
//                        this.emitChange();
//                        break;

//                    // add more cases for other actionTypes, like TODO_UPDATE, etc.
//                }

//                return true; // No errors. Needed by promise in Dispatcher.
//            });
//        }
//    }
//}