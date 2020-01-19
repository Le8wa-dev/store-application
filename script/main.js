'use strict';
document.addEventListener('DOMContentLoaded', () => {

// **** Константы

    const search = document.querySelector('.search'), // поиск
        cartBtn = document.getElementById('cart'), // кнопка корзины в хедере
        cart = document.querySelector('.cart'), // модальное окно корзины(вместе с оверлеем)
        wishlistBtn = document.getElementById('wishlist'), // кнопка - избранное
        goodsWrapper = document.querySelector('.goods-wrapper'), // контейнер на странице под карточки товаров
        cartWrapper = document.querySelector('.cart-wrapper'), // контейнер в корзине под карточки товаров
        category = document.querySelector('.category'), // контейнер с категориями
        cartCounter = cartBtn.querySelector('.counter'), // щетчик товаров в корзине
        wishlistCounter = wishlistBtn.querySelector('.counter'); // щетчик товаров в избранном

        // массив id избранных товаров
        const wishlist = [];
        // объект с id товаров в корзине
        const goodsBasket = {};
    
// ***** Переменные

// ***** Функции

        // лоадер
        const loading = (nameFunc) => {
            // добавим в контейнер с товарами лоадер

            const spinner =    `<div id="spinner">
                                            <div class="spinner-loading">
                                                <div><div><div></div></div><div><div></div></div>
                                                <div><div></div></div><div><div></div></div></div>
                                            </div>
                                        </div>`;
            // проверка перед какой функции запускается лоадер
            if( nameFunc === 'renderCard') {
                // добавим в контейнер с товарами на странице лоадер
                goodsWrapper.innerHTML = spinner;
            }

            if( nameFunc === 'renderCardBasket') {
                // добавим в контейнер с товарами в корзине лоадер
                cartWrapper.innerHTML = spinner;
            }
        };

        // получение товаров из базы данных
        const getGoods = (func, filter) => {
            // вызываем функцию с лоадером
            loading(func.name);
            // получим данные с нашего файла db.json
            fetch('./db/db.json')
                .then(response => response.json()) // переводим полученный объект в массив
                .then(filter) // фильтрация по категориям
                .then(func); // вызываем функцию с аргументом response.json(массив с товарами)
        };

    // **** рендер товаров на странице

        // создание карточки товара
        const createCardGoods = (id, title, price, img) => {
            const card = document.createElement('div');
            card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';

            // верстка карточки
            card.innerHTML =   `<div class="card">
                                    <div class="card-img-wrapper">
                                        <img class="card-img-top" src="${img}" alt="">
                                        <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
                                            data-goods-id="${id}"></button>
                                    </div>
                                    <div class="card-body justify-content-between">
                                        <a href="#" class="card-title">${title}</a>
                                        <div class="card-price">${price} ₽</div>
                                        <div>
                                            <button class="card-add-cart" data-goods-id="${id}">
                                                Добавить в корзину
                                            </button>
                                        </div>
                                    </div>
                                </div>`;

            return card;
        };

        // функция обработки карточек товара, принимает массив с объектами(товарами)
        const renderCard = arr => {
            // очищаем контейнер с товарами, перед загрузкой новых данных
            goodsWrapper.textContent = '';

            // проверка есть ли товары(length должен быть больше 0)
            if(arr.length) {
                arr.forEach(item => {
                    // деструктуризируем поля каждого объекта(товара) 
                    // в переменные передаваемые в createCardGoods
                    const { id, title, price, imgMin} = item;
                    // передаем их в функцию создания карточки товара
                    const el = createCardGoods(id, title, price, imgMin);
                    // вставляем элемент в контейнер с товарами
                    goodsWrapper.appendChild(el);
                });            
            } else {
                goodsWrapper.textContent = '❌ Извините, по вашему запросу товаров не найдено';
            }


        };

    // **

    // **** рендер товаров в корзине

        // создание карточки товара в корзине
        const createCardGoodsBasket = (id, title, price, img) => {
            const card = document.createElement('div');
            card.className = 'goods';

            // верстка карточки
            card.innerHTML =   `<div class="goods-img-wrapper">
                                    <img class="goods-img" src="${img}" alt="">

                                </div>
                                <div class="goods-description">
                                    <h2 class="goods-title">${title}</h2>
                                    <p class="goods-price">${price} ₽</p>

                                </div>
                                <div class="goods-price-count">
                                    <div class="goods-trigger">
                                        <button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}" 
                                            data-goods-id="${id}">
                                        </button>
                                        <button class="goods-delete" data-goods-id="${id}"></button>
                                    </div>
                                    <div class="goods-count">${goodsBasket[id]}</div>
                                </div>`;

            return card;
        };

        // функция обработки карточек товара в корзине, принимает массив с объектами(товарами)
        const renderCardBasket = arr => {
            // очищаем контейнер с товарами, перед загрузкой новых данных
            cartWrapper.textContent = '';

            // проверка есть ли товары(length должен быть больше 0)
            if(arr.length) {
                arr.forEach(item => {
                    // деструктуризируем поля каждого объекта(товара) 
                    // в переменные передаваемые в createCardGoods
                    const { id, title, price, imgMin} = item;
                    // передаем их в функцию создания карточки товара
                    const el = createCardGoodsBasket(id, title, price, imgMin);
                    // вставляем элемент в контейнер с товарами
                    cartWrapper.appendChild(el);
                });            
            } else {
                cartWrapper.innerHTML =   `<div id="cart-empty">
                                                Ваша корзина пока пуста
                                            </div>`;
            }
        };

    // **

    // **** Счетчики, калькуляторы 

        // посдчет стоимости товаров в корзине
        const calcTotalPrice = arr => {
            let sum = 0;
            // калькулируем по каждому элементу и
            // умножаем на количество самого товара
            for(const item of arr) {
                sum += item.price * goodsBasket[item.id];
            }
            // вставляем итоговую сумму в верстку
            cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
        };

        // функция подсчета товаров в корзине и в избранном
        const checkCount = () => {
            // щетчик в избранном
            wishlistCounter.textContent = wishlist.length;
            // щетчик в корзине
            cartCounter.textContent = Object.keys(goodsBasket).length;
        };

    // **

    // **** Фильтры

        // отображение товаров в корзине
        const showCardBasket = arr => {
            // в массиве элементов проверим наличие id в корзине
            const basketGoods = arr.filter(item => goodsBasket.hasOwnProperty(item.id));
            // считаем стоимость
            calcTotalPrice(basketGoods);
            // возвращаем товары для дальнейшего рендера
            return basketGoods;
        };

        // функция рандомной сортировки
        const randomSort = item => {
            const el = item.sort(() => Math.random() - 0.5)
            return el
        };

        // отображение избранного
        const showWishlist = () => {
            getGoods(renderCard, arr => {
                // в массиве элементов проверим наличие id в избранном
                return arr.filter(item => wishlist.includes(item.id))
            });
        };

    // **

    // **** Работа с хранилищами

        // функция чтения cookie
        const getCookie = (name) => {
            let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        };

        // функция записи в cookie
        const cookieQuery = get => {
            // проверим получаем данные или отдаем
            if(get) {
                // проверим есть ли что-то в куки
                if( getCookie('goodsBasket') ){
                    // соберем все свойства объекта из куки и добавим в объект корзины товаров
                    Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
                }
                // обновим счетчики
                checkCount();
            } else {
                // заносим данные в cookie
                document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`;
            }
        };

        // функция сохранения данных в localStorage
        const storageQuery = (get) => {
            // проверим получаем данные или отдаем
            if(get) {
                // если в local есть данные
                if(localStorage.getItem('wishlist')) {
                    // заносим в массив избранное данные с local
                    wishlist.push(...JSON.parse(localStorage.getItem('wishlist')))
                }
                // обновим счетчики
                checkCount()
            } else {
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            }
        };

    // **

    // **** События

        // закрытие корзины
        const closeCart = e => {
            const target = e.target;

            // делегируем закрытие только на оверлеей, на кнопку close(крестик) или на escape
            if( target.classList.contains('cart') ||
                target.classList.contains('cart-close') ||
                e.keyCode === 27 ) {

                cart.style.display = '';
                // отключаем прослушку закрытия на escape
                document.removeEventListener('keyup', closeCart);
            }
        };

        // отображение корзины
        const openCart = e => {
            e.preventDefault();
            cart.style.display = 'flex';
            // прослушка для того чтоб закрывать на esc
            document.addEventListener('keyup', closeCart);
            getGoods(renderCardBasket, showCardBasket);
        };

        // вывод товаров по категориям
        const chooseCategory = e => {
            e.preventDefault();
            const target = e.target;

            if( target.classList.contains('category-item__all') ) {
                // выводим все товары
                getGoods(renderCard, randomSort);

            } else 

            if( target.classList.contains('category-item') ) {
                // категрия соответствующая data-атрибуту target
                const currentCategory = target.dataset.category;

                getGoods(renderCard, arr => {
                    // вернем новый массив с заданной категорией
                    return arr.filter(item => {
                        // у каждого элемента проверяем совпадение категорий
                        // у некоторых элементов несколько категорий(лежат в массиве)
                        const result = item.category.includes(currentCategory);
                        // вернется true || false
                        return result;
                    });
                });

            };
        };

        // поиск таваров
        const searchGoods = e => {
            e.preventDefault();
            // получим инпут поля поиска
            // e.target - всегда будет формой
            // получим элементы через form.elements и уже оттуда наш инпут
            const input = e.target.elements.searchGoods;
            const value = input.value.trim();
            
            if( value !== '') {
                // создадим регулярное выражение для поиска совпадения
                const searchString = new RegExp(value, 'i')
                // в фильтр передадим только товары с совпадающим названием
                getGoods(renderCard, arr => {
                    // в массиве элементов проверим наличие у каждого item.title в searchString
                    return arr.filter(item => searchString.test(item.title))
                });

            } else {
                // если поиск по пустой строке
                // подсвечиваем поле ввода search
                search.classList.add('error');
                // через 2сек(время анимации) уберем присвоенный класс 
                setTimeout(() => {
                    search.classList.remove('error');
                }, 2000);
            }
            // очищаем поле поиска после рендеринга товаров
            input.value ='';
        };

        // функция добавляет и удаляет id из массива избранное
        const toggleWishlist = (id, elem) => {
            // проверим наличие id товара в массиве избранное
            if(wishlist.includes(id)){
                // удаляем id из массива
                wishlist.splice(wishlist.indexOf(id), 1)
                // делаем кнопку(сердечко) неактивной
                elem.classList.remove('active');
            } else {
                // добавим id в массив
                wishlist.push(id);
                // делаем кнопку(сердечко) активной
                elem.classList.add('active');
            }

            // обновляем щетчик товаров в избранном
            checkCount();
            // сохраняем в local
            storageQuery();
        };

        // добавление в корзину
        const addBasket = id => {
            // проверим есть ли товар в объекте 
            if( goodsBasket[id] ){
                // при каждом клике в ключе id добавляем его значению единицу 
                goodsBasket[id] += 1;
            } else {
                // если товара в объекте небыло, тогда значению ключа id присваеваем единицу
                goodsBasket[id] = 1;
            }

            // обновляем счетчик товаров в корзине
            checkCount();
            // сохраняем в cookie
            cookieQuery(); 
        };

        // удаление из элемента из корзины
        const removeGoods = id => {
            // удалим по id в массиве товаров корзины
            delete goodsBasket[id];
            // обновим счетчики
            checkCount();
            // обновим куки
            cookieQuery();
            // рендер товаров в корзине
            getGoods(renderCardBasket, showCardBasket);
        };

    // **

    // **** Хендлеры

        // добавление в избранное из корзины
        const handlerBasket = e => {
            const target = e.target;
            // проверка клика в корзине на кнопку добавить в избранное 
            if( target.classList.contains('goods-add-wishlist') ){
                // 1 параметр - id из дата атрибута в массив избранное
                toggleWishlist(target.dataset.goodsId, target)
            };
            // проверка клика в корзине на кнопку удалить из корзины 
            if( target.classList.contains('goods-delete') ){
                // id из дата атрибута в массив избранное
                removeGoods(target.dataset.goodsId);
            };
        };

        // функция обработки клика на товары 
        const handlerGoods = e => {
            const target = e.target;
            // проверка клика на кнопку добавить в избранное
            if( target.classList.contains('card-add-wishlist') ){
                // 1 параметр - id из дата атрибута в массив избранное
                toggleWishlist(target.dataset.goodsId, target)
            };

            if( target.classList.contains('card-add-cart') ){
                // параметр - id из дата атрибута в массив избранное 
                addBasket(target.dataset.goodsId)
            }

        };

    // **


    // **** Инициализация 
    {
    getGoods(renderCard, randomSort);
    storageQuery(true);
    cookieQuery(true);

    // ***** Оработчики
    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', chooseCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapper.addEventListener('click', handlerBasket);
    wishlistBtn.addEventListener('click', showWishlist);
    }

});