async function fetch_json(url) {
    return (await fetch(url)).json();
}

(async () => {
    const shops = await fetch_json('src/json/shops.json');
    const item_types = await fetch_json('src/json/item_types.json');
    const tags = await fetch_json('src/json/tags.json');

    const search_text_element = document.getElementById('search_text');
    const search_tags_element = document.getElementById('search_tags');
    const search_button_element = document.getElementById('search_button');
    for(let tag of Object.keys(tags).sort()) {
        const search_tag_id = `search_${tag}`;
        const search_tag_input_element = document.createElement('input');
        search_tag_input_element.id = search_tag_id;
        search_tag_input_element.type = 'checkbox';
        tags[tag].input = search_tag_input_element;

        const search_tag_label_element = document.createElement('label');
        search_tag_label_element.htmlFor = search_tag_id;
        search_tag_label_element.innerText = tag;

        const search_tag_element = document.createElement('tag');
        search_tag_element.appendChild(search_tag_input_element);
        search_tag_element.appendChild(search_tag_label_element);
        search_tags_element.appendChild(search_tag_element);
    }
    const shops_element = document.getElementById('shops');
    for(let shop of shops) {
        shop.tags = shop.tags || [];
        const shop_element = document.createElement('shop');
        shop_element.innerText = shop.name;
        shop.element = shop_element;
        shops_element.appendChild(shop_element);
    }

    const search = () => {
        const search_text = search_text_element.value;
        let wanted_tags = [];
        for(let tag of Object.keys(tags)) {
            if(tags[tag].input.checked) {
                wanted_tags.push(tag);
            }
        }
        for(let shop of shops) {
            shop.element.classList.remove('filtered');
            if(!shop.name.toLowerCase().includes(search_text.toLowerCase())) {
                continue;
            }
            if(!wanted_tags.every(t => shop.tags.includes(t))) {
                continue;
            }
            
            shop.element.classList.add('filtered');
        }
    };

    search_text_element.addEventListener('keydown', e => {
        if(e.key === 'Enter') {
            search();
        }
    });
    search_button_element.addEventListener('click', e => search());
})();