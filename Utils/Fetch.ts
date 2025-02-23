
export class Fetch {

    public static async request(path: string, json: object = {}, method: string = "POST") {

        const response = await fetch(`${path}`, {
            method: method,
            body: JSON.stringify(json),
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },

        });

        return await response.json();

    }

}