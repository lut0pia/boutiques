async function fetch_json(url) {
    return (await fetch(url)).json();
}

(async () => {
    const shops = await fetch_json('src/json/shops.json');
    const items = await fetch_json('src/json/items.json');
    const tags = await fetch_json('src/json/tags.json');

    // Sanitize shops
    for(let shop of shops) {
        shop.tags = shop.tags || [];
        shop.items = shop.items || {};
        shop.websites = shop.websites || [];
        
        // Fill implicit item information
        // TODO: Handle prices
        let shop_item_ids = Object.keys(shop.items);
        for(let shop_item_id of shop_item_ids) {
            const shop_item_desc = items[shop_item_id];
            if(shop_item_desc.implies && !shop.items[shop_item_desc.implies]) {
                shop.items[shop_item_desc.implies] = {};
                shop_item_ids.push(shop_item_desc.implies);
            }
        }
    }

    const search_text_element = document.getElementById('search_text');
    const search_tags_element = document.getElementById('search_tags');
    for(let tag_id of Object.keys(tags).sort()) {
        const tag = tags[tag_id];
        const search_tag_id = `search_${tag_id}`;

        const search_tag_input_element = document.createElement('input');
        search_tag_input_element.id = search_tag_id;
        search_tag_input_element.type = 'checkbox';
        tag.input = search_tag_input_element;

        const search_tag_label_element = document.createElement('label');
        search_tag_label_element.htmlFor = search_tag_id;
        search_tag_label_element.innerText = `${tag.icon || ''} ${tag.name}`;

        const search_tag_element = document.createElement('tag');
        search_tag_element.appendChild(search_tag_input_element);
        search_tag_element.appendChild(search_tag_label_element);
        search_tags_element.appendChild(search_tag_element);
    }

    const search_items_element = document.getElementById('search_items');
    for(let item_id of Object.keys(items)) {
        const item = items[item_id];
        const search_item_id = `search_${item_id}`;

        const search_item_input_element = document.createElement('input');
        search_item_input_element.id = search_item_id;
        search_item_input_element.type = 'checkbox';
        item.input = search_item_input_element;

        const search_item_label_element = document.createElement('label');
        search_item_label_element.htmlFor = search_item_id;
        search_item_label_element.innerText = item.name;

        const search_item_element = document.createElement('item');
        search_item_element.appendChild(search_item_input_element);
        search_item_element.appendChild(search_item_label_element);
        search_items_element.appendChild(search_item_element);
    }

    const shops_element = document.getElementById('shops');
    for(let shop of shops) {
        const shop_name_element = document.createElement('name');
        shop_name_element.innerText = shop.name;
        
        const shop_tags_element = document.createElement('tags');
        for(let tag of shop.tags) {
            const shop_tag_element = document.createElement('tag');
            const shop_tag_icon = document.createElement('icon');
            shop_tag_icon.innerText = tags[tag].icon;
            shop_tag_icon.title = tags[tag].name;
            const shop_tag_name = document.createElement('name');
            shop_tag_name.innerText = tags[tag].name;
            shop_tag_element.appendChild(shop_tag_icon);
            shop_tag_element.appendChild(shop_tag_name);
            shop_tags_element.appendChild(shop_tag_element);
        }
        
        const shop_address_element = document.createElement('address');
        shop_address_element.innerText = shop.address;

        const shop_websites_element = document.createElement('websites');
        for(let website of shop.websites) {
            const shop_website_element = document.createElement('a');
            shop_website_element.innerText =  shop_website_element.href = website;
            shop_websites_element.appendChild(shop_website_element);
        }

        const shop_map_element = document.createElement('iframe');
        const encoded_address = encodeURIComponent(`${shop.name}, ${shop.address}`);
        shop_map_element.src = `https://maps.google.com/maps?q=${encoded_address}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;

        const shop_expand_button = document.createElement('expand');
        shop_expand_button.addEventListener('click', e => {
            shop.element.classList.toggle("expanded");
        });
        
        const shop_element = document.createElement('shop');
        shop.element = shop_element;
        shop_element.appendChild(shop_name_element);
        shop_element.appendChild(shop_tags_element);
        shop_element.appendChild(shop_address_element);
        shop_element.appendChild(shop_websites_element);
        shop_element.appendChild(shop_map_element);
        shop_element.appendChild(shop_expand_button);
        shops_element.appendChild(shop_element);
    }

    const search = () => {
        const search_text = search_text_element.value;
        let wanted_tags = [];
        for(let tag_id of Object.keys(tags)) {
            if(tags[tag_id].input.checked) {
                wanted_tags.push(tag_id);
            }
        }
        let wanted_items = [];
        for(let item_id of Object.keys(items)) {
            if(items[item_id].input.checked) {
                wanted_items.push(item_id);
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
            if(!wanted_items.every(i => shop.items[i])) {
                continue;
            }
            
            shop.element.classList.add('filtered');
        }
    };

    search_text_element.addEventListener('input', search);
    for(let tag of Object.values(tags)) {
        tag.input.addEventListener('change', search);
    }
    for(let item of Object.values(items)) {
        item.input.addEventListener('change', search);
    }

    search();
})();