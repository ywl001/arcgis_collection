import { People } from "../app-state";

export class KinshipNode {

    id?: string;
    private _sibHuman?: People;
    public get sibHuman(): People {
        return this._sibHuman;
    }
    public set sibHuman(value: People) {
        this._sibHuman = value;
        this.setId();
    }
    private _spouse?: People;
    public get spouse(): People {
        return this._spouse;
    }
    public set spouse(value: People) {
        this._spouse = value;
        this.setId();
    }

    level?: number;
    children?: KinshipNode[] = [];
    parent?: KinshipNode;

    isBaseNode?:boolean;

    flag?: number;

    private setId() {
        if (this.sibHuman?.sex == '男')
            this.id = [this.sibHuman?.pid, this.spouse?.pid].filter(Boolean).join();
        else
            this.id = [this.spouse?.pid, this.sibHuman?.pid].filter(Boolean).join();
    }

    /**
     * 关系不明确时设置节点人员
     * @param p 
     */
    setPeople(p: People): void {
        if (this.sibHuman && p.pid != this.sibHuman.pid) {
            this.spouse = p;
        } else if (this.spouse && p.pid != this.spouse.pid) {
            this.sibHuman = p;
        }
        else if (!this.sibHuman && !this.spouse) {
            if (p.sex == '男') {
                this.sibHuman = p;
            } else {
                this.spouse = p;
            }
        }
    }

    get name(): string {
        if (this.sibHuman)
            return this.sibHuman.name;
        return this.spouse?.name;
    }

    get pid(): string {
        if (this.sibHuman)
            return this.sibHuman.pid;
        return this.spouse?.pid;
    }

}