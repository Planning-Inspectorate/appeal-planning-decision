class ContactDetailsValueObject {

    #appellantName;
    #appellantEmail;
    #agentName;
    #agentEmail;

    constructor(appellantName, appellantEmail, agentName, agentEmail){
        this.#appellantName = appellantName;
        this.#appellantEmail = appellantEmail;
        this.#agentName = agentName;
        this.#agentEmail = agentEmail;
    }

    getAppellantName(){
        return this.#appellantName;
    }

    getAppellantEmail(){
        return this.#appellantEmail;
    }

    getAgentName(){
        return this.#agentName;
    }

    getAgentEmail(){
        return this.#agentEmail
    }
}

module.exports = ContactDetailsValueObject;