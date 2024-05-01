import { Injectable } from "@angular/core";
import { Database, Registry, Validator, helpers } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";
import { TableLandCredentials } from "../shared/tableland-credentials";

interface TableSchema {
    id: number;
    val: string;
}

@Injectable({
    providedIn: 'root',
})
export class TableLandService {

    constructor() {
    }

    connect() {
        const privateKey = TableLandCredentials.TABLELAND_PRIVATE_KEY;
        const wallet = new Wallet(privateKey);
        const provider = getDefaultProvider(TableLandCredentials.TABLELAND_PROVIDER);
        const signer = wallet.connect(provider);

        const db: Database<TableSchema> = new Database({ signer });
        window.db = db;
        console.info('tableland init', 'TableLand service has been initialized!');
        return true;
    }

    async isFactoryDone()  {
        const registry = await Registry.forSigner(window.db.config.signer);
        return await registry.listTables();
    }

    async factory() {
        await this.userFactory().catch((er) => console.error(er));
        await this.addressFactory().catch((er) => console.error(er));
        await this.employeeFactory().catch((er) => console.error(er));
        await this.departmentFactory().catch((er) => console.error(er));
        await this.officeFactory().catch((er) => console.error(er));
        console.log("Tableland factory done");
        return true;
    }

    async userFactory() {
        const prefix = "users";
        const { meta: create } = await window.db
            .prepare(`CREATE TABLE ${prefix} (id integer primary key not null, metamaskAddress text not null, firstName text not null, lastName text not null, birthDay text not null, sex integer, addressId integer, employeeId integer, notes text);`)
            .run();
        await create.txn?.wait();
        const tableName = create.txn?.names[0] ?? "";
        const execWrites = await window.db.batch([
            window.db.prepare(`INSERT INTO ${tableName} (id, metamaskAddress, firstName, lastName, birthDay, sex, addressId, employeeId, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`).bind(1, "0x4449B512c20BA8eda6a0f1Ec4938Baca2E270439", "Patrik", "Hyll", "08/09/1999", 1, 1, 1, "boss"),
            window.db.prepare(`INSERT INTO ${tableName} (id, metamaskAddress, firstName, lastName, birthDay, sex, addressId, employeeId, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`).bind(2, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "Ľudovít", "Mitrenga", "08/09/1999", 2, 2, 2, "novy"),
            window.db.prepare(`INSERT INTO ${tableName} (id, metamaskAddress, firstName, lastName, birthDay, sex, addressId, employeeId, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`).bind(3, "0x4449B512c20BA8eda6a0f1Ec4938Baca2E270439", "Hugo", "Ludvig", "08/09/1999", 2, 3, 3, "employ"),
            window.db.prepare(`INSERT INTO ${tableName} (id, metamaskAddress, firstName, lastName, birthDay, sex, addressId, employeeId, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`).bind(4, "0x4449B512c20BA8eda6a0f1Ec4938Baca2E270439", "Emanuel", "Lol", "08/09/1999", 2, 4, 4, ""),
            window.db.prepare(`INSERT INTO ${tableName} (id, metamaskAddress, firstName, lastName, birthDay, sex, addressId, employeeId, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`).bind(5, "0x4449B512c20BA8eda6a0f1Ec4938Baca2E270439", "Anna", "Mária", "08/09/1999", 1, 5, 5, "poznámka"),
        ]);
        await execWrites.txn?.wait();
    }

    async addressFactory() {
        const prefix = "address";
        const { meta: create } = await window.db
            .prepare(`CREATE TABLE ${prefix} (id integer primary key not null, country text not null, city text not null, street text not null, streetNo text, zipCode text);`)
            .run();
        await create.txn?.wait();
        const tableName = create.txn?.names[0] ?? ""; // e.g., my_table_31337_2
        const execWrites = await window.db.batch([
            window.db.prepare(`INSERT INTO ${tableName} (id, country, city, street, streetNo, zipCode) VALUES (?, ?, ?, ?, ?, ?);`).bind(1, "Slovenská republika", "Žilina", "Rázusová", "1025/18", "02401"),
            window.db.prepare(`INSERT INTO ${tableName} (id, country, city, street, streetNo, zipCode) VALUES (?, ?, ?, ?, ?, ?);`).bind(2, "Slovenská republika", "Žilina", "Rázusová", "1025/18", "02401"),
            window.db.prepare(`INSERT INTO ${tableName} (id, country, city, street, streetNo, zipCode) VALUES (?, ?, ?, ?, ?, ?);`).bind(3, "Slovenská republika", "Žilina", "Rázusová", "1025/18", "02401"),
            window.db.prepare(`INSERT INTO ${tableName} (id, country, city, street, streetNo, zipCode) VALUES (?, ?, ?, ?, ?, ?);`).bind(4, "Slovenská republika", "Žilina", "Rázusová", "1025/18", "02401"),
            window.db.prepare(`INSERT INTO ${tableName} (id, country, city, street, streetNo, zipCode) VALUES (?, ?, ?, ?, ?, ?);`).bind(5, "Slovenská republika", "Žilina", "Rázusová", "1025/18", "02401"),
        ]);
        await execWrites.txn?.wait();
    }

    async employeeFactory() {
        const prefix = "employee";
        const { meta: create } = await window.db
            .prepare(`CREATE TABLE ${prefix} (id integer primary key not null, departmentId integer, officeId integer);`)
            .run();
        await create.txn?.wait();

        const tableName = create.txn?.names[0] ?? ""; // e.g., my_table_31337_2
        console.log(tableName);

        const execWrites = await window.db.batch([
            window.db.prepare(`INSERT INTO ${tableName} (id, departmentId, officeId) VALUES (?, ?, ?);`).bind(1, 1, 1),
            window.db.prepare(`INSERT INTO ${tableName} (id, departmentId, officeId) VALUES (?, ?, ?);`).bind(2, 2, 2),
            window.db.prepare(`INSERT INTO ${tableName} (id, departmentId, officeId) VALUES (?, ?, ?);`).bind(3, 3, 3),
            window.db.prepare(`INSERT INTO ${tableName} (id, departmentId, officeId) VALUES (?, ?, ?);`).bind(4, 4, 4),
            window.db.prepare(`INSERT INTO ${tableName} (id, departmentId, officeId) VALUES (?, ?, ?);`).bind(5, 5, 5),
        ]);
        await execWrites.txn?.wait();
    }

    async officeFactory() {
        const prefix = "office";
        const { meta: create } = await window.db
            .prepare(`CREATE TABLE ${prefix} (id integer primary key not null, name text not null, capacity integer);`)
            .run();
        await create.txn?.wait();
        const tableName = create.txn?.names[0] ?? ""; // e.g., my_table_31337_2
        const execWrites = await window.db.batch([
            window.db.prepare(`INSERT INTO ${tableName} (id, name, capacity) VALUES (?, ?, ?);`).bind(1, "Kriváň", 3),
            window.db.prepare(`INSERT INTO ${tableName} (id, name, capacity) VALUES (?, ?, ?);`).bind(2, "Gerlach", 2),
            window.db.prepare(`INSERT INTO ${tableName} (id, name, capacity) VALUES (?, ?, ?);`).bind(3, "Rosutec", 5),
            window.db.prepare(`INSERT INTO ${tableName} (id, name, capacity) VALUES (?, ?, ?);`).bind(4, "Suchý", 10),
            window.db.prepare(`INSERT INTO ${tableName} (id, name, capacity) VALUES (?, ?, ?);`).bind(5, "Šíp", 3),
        ]);
        await execWrites.txn?.wait();
    }

    async departmentFactory() {
        const prefix = "department";
        const { meta: create } = await window.db
            .prepare(`CREATE TABLE ${prefix} (id integer primary key not null, field text);`)
            .run();
        await create.txn?.wait();
        const tableName = create.txn?.names[0] ?? ""; // e.g., my_table_31337_2
        const execWrites = await window.db.batch([
            window.db.prepare(`INSERT INTO ${tableName} (id, field) VALUES (?, ?);`).bind(1, 'R&D'),
            window.db.prepare(`INSERT INTO ${tableName} (id, field) VALUES (?, ?);`).bind(2, 'Accounting'),
            window.db.prepare(`INSERT INTO ${tableName} (id, field) VALUES (?, ?);`).bind(3, 'Finance'),
            window.db.prepare(`INSERT INTO ${tableName} (id, field) VALUES (?, ?);`).bind(4, 'H&R'),
            window.db.prepare(`INSERT INTO ${tableName} (id, field) VALUES (?, ?);`).bind(5, 'Workforce'),
        ]);
        await execWrites.txn?.wait();
    }
}