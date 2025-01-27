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
    for(let tag_name of Object.keys(tags).sort()) {
        const tag = tags[tag_name];
        const search_tag_id = `search_${tag_name}`;
        const search_tag_input_element = document.createElement('input');
        search_tag_input_element.id = search_tag_id;
        search_tag_input_element.type = 'checkbox';
        tags[tag_name].input = search_tag_input_element;

        const search_tag_label_element = document.createElement('label');
        search_tag_label_element.htmlFor = search_tag_id;
        search_tag_label_element.innerText = `${tag.icon || ''} ${tag_name}`;

        const search_tag_element = document.createElement('tag');
        search_tag_element.appendChild(search_tag_input_element);
        search_tag_element.appendChild(search_tag_label_element);
        search_tags_element.appendChild(search_tag_element);
    }
    const shops_element = document.getElementById('shops');
    for(let shop of shops) {
        shop.tags = shop.tags || [];
        shop.websites = shop.websites || [];
        
        const shop_name_element = document.createElement('name');
        shop_name_element.innerText = shop.name;
        
        const shop_address_element = document.createElement('address');
        shop_address_element.innerText = shop.address;

        const shop_websites_element = document.createElement('websites');
        for(let website of shop.websites) {
            const shop_website_element = document.createElement('a');
            shop_website_element.innerText =  shop_website_element.href = website;
            shop_websites_element.appendChild(shop_website_element);
        }
        
        const shop_element = document.createElement('shop');
        shop.element = shop_element;
        shop_element.appendChild(shop_name_element);
        shop_element.appendChild(shop_address_element);
        shop_element.appendChild(shop_websites_element);
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