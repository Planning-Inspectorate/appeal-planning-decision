export class DateService{
    
    constructor(){        
        this.date = new Date();
    }

    today(){
        return this.date.getDate();
    }

    previousDay(){
        const previousDay = new Date(this.date);
        previousDay.setDate(this.date.getDate()-1);
        return previousDay.getDate();
    }

    nextDay(){
        const nextDay = new Date(this.date);
        nextDay.setDate(this.date.getDate()+1);
        return nextDay.getDate();
    }

    nextMonth(){
        const nextMonth = new Date(this.date.getFullYear(),this.date.getMonth()+1,this.date.getDate());
        return nextMonth.getMonth()+1;
    }

    previousMonth(){
        const previousMonth = new Date(this.date.getFullYear(),this.date.getMonth()-1,this.date.getDate());
        return previousMonth.getMonth()+1;
    }

    currentMonth(){
        return this.date.getMonth()+1;
    }

    currentYear(){
        return this.date.getFullYear();
    }

    previousYear(){
        const previousYear = new Date(this.date.getFullYear()-1,this.date.getMonth(),this.date.getDate());
        return previousYear.getFullYear();
    }

    nextYear(){
        const nextYear = new Date(this.date.getFullYear()+1,this.date.getMonth(),this.date.getDate());
        return nextYear.getFullYear();
    }
}