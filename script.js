fetch(
    "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json"
)
    .then((response) => response.json())
    .then((data) => {
        let names = data.map((obj) => obj.name);
        let sortedNames = names.sort();

        let input = document.getElementById("input");

        input.addEventListener("keyup", (e) => {
            removeElements();
            for (let i of sortedNames) {
                if (
                    i.toLowerCase().startsWith(input.value.toLowerCase()) &&
                    input.value != ""
                ) {
                    let listItem = document.createElement("li");

                    listItem.classList.add("list-items");
                    listItem.style.cursor = "pointer";
                    // listItem.setAttribute("onclick", "displayNames('" + i + "')");

                    let word = "<b>" + i.substr(0, input.value.length) + "</b>";
                    word += i.substr(input.value.length);

                    listItem.innerHTML = word;
                    const ulElement = document
                        .querySelector(".list")
                        .appendChild(listItem);
                    ulElement.style.backgroundColor = "#45f3ff";
                    ulElement.style.borderRadius = "0 0 5px 5px";
                    ulElement.style.top = "100%"; // positions the list beneath the input box
                    ulElement.style.position = "relative";
                    ulElement.style.width = "100%";
                    ulElement.style.zIndex = "999";
                }
            }
            addListItemsEventListeners();
        });
        function addListItemsEventListeners() {
            const listItems = document.querySelectorAll(".list-items");
            listItems.forEach((listItem) => {
              listItem.addEventListener("click", () => {
                input.value = listItem.textContent;
                removeElements();
              });
            });
          }
        function removeElements() {
            let items = document.querySelectorAll(".list-items");
            items.forEach((item) => {
                item.remove();
            });
        }

        document.addEventListener("click", (e) => {
            const dropdown = document.querySelector(".list");
            if (!dropdown.contains(e.target)) {
                removeElements();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                removeElements();
            }
        });
    })
    .catch((error) => console.log(error));