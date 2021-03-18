import { v4 as uuuIdV4 } from 'uuid'

class Specification {
    id?: string;
    name: string;
    description: string;
    created_At: Date;

    constructor() {
        if (!this.id) {
            this.id = uuuIdV4();
        }
    }
}

export { Specification }