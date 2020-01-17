document.addEventListener('DOMContentLoaded', () => {

// **** Константы

    const search = document.querySelector('.search'), // поиск
        cartBtn = document.getElementById('cart'), // кнопка корзины в хедере
        cart = document.querySelector('.cart'), // модальное окно корзины(вместе с оверлеем)
        wishlistBtn = document.getElementById('wishlist'), // кнопка - избранное
        goodsWrapper = document.querySelector('.goods-wrapper'), // контейнер под карточки товаров
        category = document.querySelector('.category'); // контейнер с категориями
    
// **** Переменные



// ***** Функции

    // создание карточки товара
    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';

        // верстка карточки
        card.innerHTML =   `<div class="card">
                                <div class="card-img-wrapper">
                                    <img class="card-img-top" src="${img}" alt="">
                                    <button class="card-add-wishlist" data-goods-id="${id}"></button>
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

        arr.forEach(item => {
            // деструктуризируем поля каждого объекта(товара) 
            // в переменные передаваемые в createCardGoods
            const { id, title, price, imgMin} = item;
            // передаем их в функцию создания карточки товара
            const el = createCardGoods(id, title, price, imgMin);
            // вставляем элемент в контейнер с товарами
            goodsWrapper.appendChild(el);
        });
    };

    // отображение корзины
    const openCart = e => {
        e.preventDefault();
        cart.style.display = 'flex';
        // прослушка для того чтоб закрывать на esc
        document.addEventListener('keyup', closeCart);
    };

    // закрытие корзины
    const closeCart = e => {
        let target = e.target;

        // делегируем закрытие только на оверлеей, на кнопку close(крестик) или на escape
        if( target.classList.contains('cart') ||
            target.classList.contains('cart-close') ||
            e.keyCode === 27 ) {

            cart.style.display = '';
            // отключаем прослушку закрытия на escape
            document.removeEventListener('keyup', closeCart);
        }
    };

    // получение товаров из базы данных
    const getGoods = (func, filter) => {
        // получим данные с нашего файла db.json
        fetch('./db/db.json')
            .then(response => response.json()) // переводим полученный объект в массив
            .then(filter) // фильтрация по категориям
            .then(func); // вызываем функцию с аргументом response.json(массив с товарами)
    };

    // функция рандомной сортировки
    const randomSort = item => {
        el = item.sort(() => Math.random() - 0.5)
        return el
    };

    // вывод товаров по категориям
    const chooseCategory = e => {
        e.preventDefault();
        const target = e.target;

        if( target.classList.contains('category-item')) {
            // категрия соответствующая data-атрибуту target
            const category = target.dataset.category;
            console.log(category)

            getGoods(renderCard, arr => {
                // вернем новый массив с заданной категорией
                return arr.filter(item => {
                    // у каждого элемента проверяем совпадение категорий
                    // у некоторых элементов несколько категорий(лежат в массиве)
                    const result = item.category.includes(category);
                    // вернется true || false
                    return result;
                });
            });
        };
    };

// ***** Оработчики

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', chooseCategory);


    getGoods(renderCard, randomSort);

});