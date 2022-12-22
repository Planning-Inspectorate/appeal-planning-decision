export class HorizonCreateAppealContactExpectation {
    private id: string;
    private fullName: string;
    private involvement: string;

    constructor(id: string, fullName: string, involvement: string) {
        this.id = id;
        this.fullName = fullName;
        this.involvement = involvement;
    }

    getId(): string {
        return this.id;
    }

    getFullName(): string {
        return this.fullName;
    }

    getInvolvement(): string {
        return this.involvement;
    }
}