function navbarHide() {
document.addEventListener('DOMContentLoaded', function() {

    const navBtn = document.querySelector('.navbar-toggler');
    const menuToggle = document.getElementById('navbarNavAltMarkup');
    const bsCollapse = new bootstrap.Collapse(menuToggle);

    navBtn.addEventListener('blur', function() {
    let screenWidth = window.innerWidth;
    if (screenWidth < 992) {
        bsCollapse.hide();
    }

});
});
}

(function (global) {

    let dc = {};

    let homeHtml = "snippets/home-snippet.html";
    let allCategoriesUrl = 'https://davids-restaurant.herokuapp.com/categories.json';
    let categoriesTitleHtml = "snippets/categories-title-snippet.html";
    let categoryHtml = 'snippets/category-snippet.html';
    let menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    let menuItemsTitleHtml = "snippets/menu-items-title.html";
    let menuItemHtml = "snippets/menu-item.html";

    let insertHtml = function (selector, html) {
        let targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    let showLoading = function (selector) {
        let html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };


    let insertProperty = function (string, propName, propValue) {
        let propToReplace = '{{' + propName + '}}';
        string = string.replace(new RegExp(propToReplace, 'g'), propValue);
        return string;
    }

    document.addEventListener('DOMContentLoaded', function() {

        showLoading('#main-content');
        $ajaxUtils.sendGetRequest (homeHtml, function (response) {
            document.querySelector('#main-content')
            .innerHTML = response.responseText;
        });
    })

    dc.loadMenuCategories = function () {
        showLoading('#main-content');
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHtml);
    };

    dc.loadMenuItems = function(categoryShort) {
        showLoading('#main-content');
        $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowMenuItemsHtml);
    }


    function buildAndShowCategoriesHtml (categories) {

        console.log(typeof categories);
        $ajaxUtils.sendGetRequest(categoriesTitleHtml, function (categoriesTitleHtml) {

            $ajaxUtils.sendGetRequest(categoryHtml, function (categoryHtml) {
                console.log(categoryHtml)
                let categoriesViewHtml = buildCategoriesViewHtml(categories.response, categoriesTitleHtml.response, categoryHtml.response);
                insertHtml('#main-content', categoriesViewHtml);
            });
        });
    }


    function buildCategoriesViewHtml (categories, categoriesTitleHtml, categoryHtml) {
        let finalHtml = categoriesTitleHtml;
        finalHtml += '<section class="row row-cols-xs-2 row-cols-sm-2 row=cols-md-3 row-cols-lg-4 row-cols-xxl-6">';
        console.log(finalHtml);
        categories = JSON.parse(categories);
        console.log(categories[0]);

        for (let i = 0; i < categories.length; i++) {

            let html = categoryHtml;
            let name = "" + categories[i].name;
            let short_name = categories[i].short_name;

            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    function buildAndShowMenuItemsHtml (categoryMenuItems) {

        $ajaxUtils.sendGetRequest(menuItemsTitleHtml, function (menuItemsTitleHtml) {

            $ajaxUtils.sendGetRequest(menuItemHtml, function(menuItemHtml) {
                let menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems.response, menuItemsTitleHtml.response, menuItemHtml.response);
                insertHtml('#main-content', menuItemsViewHtml);
            });
        });
    }

    function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {

        categoryMenuItems = JSON.parse(categoryMenuItems);
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

        let finalHtml = menuItemsTitleHtml;
        finalHtml += '<section class="row row-cols-1 row-cols-lg-2">';

        let menuItems = categoryMenuItems.menu_items;
        let catShortName = categoryMenuItems.category.short_name;

        for (let i = 0; i < menuItems.length; i++) {

            let html = menuItemHtml;
            html = insertProperty(html, "short_name", menuItems[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertItemPrice(html, "price_small", menuItems[i].price_small);
            html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
            html = insertItemPrice(html, "price_large", menuItems[i].price_large);
            html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
            html = insertProperty(html, "name", menuItems[i].name);
            html = insertProperty(html, "description", menuItems[i].description);

            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    function insertItemPrice(html, pricePropName, priceValue) {

        if (!priceValue) {
            return insertProperty(html, pricePropName, "");
        }

        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }

    function insertItemPortionName(html, portionPropName, portionValue) {

        if (!portionValue) {
            return insertProperty(html, portionPropName, "");
        }

        return insertProperty(html, portionPropName, portionValue);
    }

    global.$dc = dc;

})(window);