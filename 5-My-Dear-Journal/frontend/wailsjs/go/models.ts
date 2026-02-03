export namespace main {
	
	export class JournalEntry {
	    date: string;
	    content: string;
	    mood: string;
	
	    static createFrom(source: any = {}) {
	        return new JournalEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.content = source["content"];
	        this.mood = source["mood"];
	    }
	}

}

