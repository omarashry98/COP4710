import { writeFile } from "fs";

getAllSchoolIds();

async function getAllSchoolIds() {
    const perPage = 100;
    let page = 0;
    let allSchools = [];

    while (true) {
        const url = `https://api.data.gov/ed/collegescorecard/v1/schools?per_page=${perPage}&page=${page}&_fields=id,school.name&api_key=JsmKNvEV08xASFhLoG8NgPyaHROVjSDhfmmKOk83`;
        const response = await fetch(url);
        const data = await response.json();
        const schools = data.results;

        if (schools.length === 0) {
            break;
        }

        allSchools = allSchools.concat(schools);
        page++;
    }

    const formattedSchools = allSchools.map((school) => {
        return {
            name: school["school.name"],
            id: school.id,
        };
    });

    // Convert formattedSchools to a string
    const data = JSON.stringify(formattedSchools);

    // Write data to a file named schools.json
    writeFile("schools.json", data, (err) => {
        if (err) throw err;
        console.log("Schools written to file");
    });
}
