     export class UserProfilePanelItem {
        private _key: string;
        private _value: string;

        constructor() {
        }

        get Key(): string {
            return this._key;
        }
        set Key(value: string) {
            this._key = value;
        }

        get Value(): string {
            return this._value;
        }
        set Value(value: string) {
            this._value = value;
        }
    }
 