document.addEventListener('DOMContentLoaded', () => {

// **** Константы

    const search = document.querySelector('.search'), // поиск
        cartBtn = document.getElementById('cart'), // кнопка корзины в хедере
        cart = document.querySelector('.cart'), // модальное окно корзины(вместе с оверлеем)
        wishlistBtn = document.getElementById('wishlist'), // избранное
        goodsWrapper = document.querySelector('.goods-wrapper'); // контейнер под карточки товаров
    
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

    // отображение корзины
    const openCart = () => {
        cart.style.display = 'flex';
    };

    // закрытие корзины
    const closeCart = e => {
        let target = e.target;

        // делегируем закрытие только на оверлеей или на кнопку close(крестик)
        if( target.classList.contains('cart') ||
            target.classList.contains('cart-close') ||
            e.keyCode === 27 ) {

            cart.style.display = '';
        }
    };


// ***** Оработчики

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    document.addEventListener('keydown', closeCart);


    // сгенерируем 3 карточки товара
    goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, 'img/temp/Archer.jpg'));
    goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 3000, 'img/temp/Flamingo.jpg'));
    goodsWrapper.appendChild(createCardGoods(3, 'Носки', 500, 'img/temp/Socks.jpg'));


});