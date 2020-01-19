'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
  // **** Константы
  var search = document.querySelector('.search'),
      // поиск
  cartBtn = document.getElementById('cart'),
      // кнопка корзины в хедере
  cart = document.querySelector('.cart'),
      // модальное окно корзины(вместе с оверлеем)
  wishlistBtn = document.getElementById('wishlist'),
      // кнопка - избранное
  goodsWrapper = document.querySelector('.goods-wrapper'),
      // контейнер на странице под карточки товаров
  cartWrapper = document.querySelector('.cart-wrapper'),
      // контейнер в корзине под карточки товаров
  category = document.querySelector('.category'),
      // контейнер с категориями
  cartCounter = cartBtn.querySelector('.counter'),
      // щетчик товаров в корзине
  wishlistCounter = wishlistBtn.querySelector('.counter'); // щетчик товаров в избранном
  // массив id избранных товаров

  var wishlist = []; // объект с id товаров в корзине

  var goodsBasket = {}; // ***** Переменные
  // ***** Функции
  // лоадер

  var loading = function loading(nameFunc) {
    // добавим в контейнер с товарами лоадер
    var spinner = "<div id=\"spinner\">\n                                            <div class=\"spinner-loading\">\n                                                <div><div><div></div></div><div><div></div></div>\n                                                <div><div></div></div><div><div></div></div></div>\n                                            </div>\n                                        </div>"; // проверка перед какой функции запускается лоадер

    if (nameFunc === 'renderCard') {
      // добавим в контейнер с товарами на странице лоадер
      goodsWrapper.innerHTML = spinner;
    }

    if (nameFunc === 'renderCardBasket') {
      // добавим в контейнер с товарами в корзине лоадер
      cartWrapper.innerHTML = spinner;
    }
  }; // получение товаров из базы данных


  var getGoods = function getGoods(func, filter) {
    // вызываем функцию с лоадером
    loading(func.name); // получим данные с нашего файла db.json

    fetch('./db/db.json').then(function (response) {
      return response.json();
    }) // переводим полученный объект в массив
    .then(filter) // фильтрация по категориям
    .then(func); // вызываем функцию с аргументом response.json(массив с товарами)
  }; // **** рендер товаров на странице
  // создание карточки товара


  var createCardGoods = function createCardGoods(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3'; // верстка карточки

    card.innerHTML = "<div class=\"card\">\n                                    <div class=\"card-img-wrapper\">\n                                        <img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"\">\n                                        <button class=\"card-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\"\n                                            data-goods-id=\"").concat(id, "\"></button>\n                                    </div>\n                                    <div class=\"card-body justify-content-between\">\n                                        <a href=\"#\" class=\"card-title\">").concat(title, "</a>\n                                        <div class=\"card-price\">").concat(price, " \u20BD</div>\n                                        <div>\n                                            <button class=\"card-add-cart\" data-goods-id=\"").concat(id, "\">\n                                                \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443\n                                            </button>\n                                        </div>\n                                    </div>\n                                </div>");
    return card;
  }; // функция обработки карточек товара, принимает массив с объектами(товарами)


  var renderCard = function renderCard(arr) {
    // очищаем контейнер с товарами, перед загрузкой новых данных
    goodsWrapper.textContent = ''; // проверка есть ли товары(length должен быть больше 0)

    if (arr.length) {
      arr.forEach(function (item) {
        // деструктуризируем поля каждого объекта(товара) 
        // в переменные передаваемые в createCardGoods
        var id = item.id,
            title = item.title,
            price = item.price,
            imgMin = item.imgMin; // передаем их в функцию создания карточки товара

        var el = createCardGoods(id, title, price, imgMin); // вставляем элемент в контейнер с товарами

        goodsWrapper.appendChild(el);
      });
    } else {
      goodsWrapper.textContent = '❌ Извините, по вашему запросу товаров не найдено';
    }
  }; // **
  // **** рендер товаров в корзине
  // создание карточки товара в корзине


  var createCardGoodsBasket = function createCardGoodsBasket(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'goods'; // верстка карточки

    card.innerHTML = "<div class=\"goods-img-wrapper\">\n                                    <img class=\"goods-img\" src=\"".concat(img, "\" alt=\"\">\n\n                                </div>\n                                <div class=\"goods-description\">\n                                    <h2 class=\"goods-title\">").concat(title, "</h2>\n                                    <p class=\"goods-price\">").concat(price, " \u20BD</p>\n\n                                </div>\n                                <div class=\"goods-price-count\">\n                                    <div class=\"goods-trigger\">\n                                        <button class=\"goods-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\" \n                                            data-goods-id=\"").concat(id, "\">\n                                        </button>\n                                        <button class=\"goods-delete\" data-goods-id=\"").concat(id, "\"></button>\n                                    </div>\n                                    <div class=\"goods-count\">").concat(goodsBasket[id], "</div>\n                                </div>");
    return card;
  }; // функция обработки карточек товара в корзине, принимает массив с объектами(товарами)


  var renderCardBasket = function renderCardBasket(arr) {
    // очищаем контейнер с товарами, перед загрузкой новых данных
    cartWrapper.textContent = ''; // проверка есть ли товары(length должен быть больше 0)

    if (arr.length) {
      arr.forEach(function (item) {
        // деструктуризируем поля каждого объекта(товара) 
        // в переменные передаваемые в createCardGoods
        var id = item.id,
            title = item.title,
            price = item.price,
            imgMin = item.imgMin; // передаем их в функцию создания карточки товара

        var el = createCardGoodsBasket(id, title, price, imgMin); // вставляем элемент в контейнер с товарами

        cartWrapper.appendChild(el);
      });
    } else {
      cartWrapper.innerHTML = "<div id=\"cart-empty\">\n                                                \u0412\u0430\u0448\u0430 \u043A\u043E\u0440\u0437\u0438\u043D\u0430 \u043F\u043E\u043A\u0430 \u043F\u0443\u0441\u0442\u0430\n                                            </div>";
    }
  }; // **
  // **** Счетчики, калькуляторы 
  // посдчет стоимости товаров в корзине


  var calcTotalPrice = function calcTotalPrice(arr) {
    var sum = 0; // калькулируем по каждому элементу и
    // умножаем на количество самого товара

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        sum += item.price * goodsBasket[item.id];
      } // вставляем итоговую сумму в верстку

    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
  }; // функция подсчета товаров в корзине и в избранном


  var checkCount = function checkCount() {
    // щетчик в избранном
    wishlistCounter.textContent = wishlist.length; // щетчик в корзине

    cartCounter.textContent = Object.keys(goodsBasket).length;
  }; // **
  // **** Фильтры
  // отображение товаров в корзине


  var showCardBasket = function showCardBasket(arr) {
    // в массиве элементов проверим наличие id в корзине
    var basketGoods = arr.filter(function (item) {
      return goodsBasket.hasOwnProperty(item.id);
    }); // считаем стоимость

    calcTotalPrice(basketGoods); // возвращаем товары для дальнейшего рендера

    return basketGoods;
  }; // функция рандомной сортировки


  var randomSort = function randomSort(item) {
    el = item.sort(function () {
      return Math.random() - 0.5;
    });
    return el;
  }; // отображение избранного


  var showWishlist = function showWishlist() {
    getGoods(renderCard, function (arr) {
      // в массиве элементов проверим наличие id в избранном
      return arr.filter(function (item) {
        return wishlist.includes(item.id);
      });
    });
  }; // **
  // **** Работа с хранилищами
  // функция чтения cookie


  var getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }; // функция записи в cookie


  var cookieQuery = function cookieQuery(get) {
    // проверим получаем данные или отдаем
    if (get) {
      // проверим есть ли что-то в куки
      if (getCookie('goodsBasket')) {
        // соберем все свойства объекта из куки и добавим в объект корзины товаров
        Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
      } // обновим счетчики


      checkCount();
    } else {
      // заносим данные в cookie
      document.cookie = "goodsBasket=".concat(JSON.stringify(goodsBasket), "; max-age=86400e3");
    }
  }; // функция сохранения данных в localStorage


  var storageQuery = function storageQuery(get) {
    // проверим получаем данные или отдаем
    if (get) {
      // если в local есть данные
      if (localStorage.getItem('wishlist')) {
        // заносим в массив избранное данные с local
        wishlist.push.apply(wishlist, _toConsumableArray(JSON.parse(localStorage.getItem('wishlist'))));
      } // обновим счетчики


      checkCount();
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }; // **
  // **** События
  // закрытие корзины


  var closeCart = function closeCart(e) {
    var target = e.target; // делегируем закрытие только на оверлеей, на кнопку close(крестик) или на escape

    if (target.classList.contains('cart') || target.classList.contains('cart-close') || e.keyCode === 27) {
      cart.style.display = ''; // отключаем прослушку закрытия на escape

      document.removeEventListener('keyup', closeCart);
    }
  }; // отображение корзины


  var openCart = function openCart(e) {
    e.preventDefault();
    cart.style.display = 'flex'; // прослушка для того чтоб закрывать на esc

    document.addEventListener('keyup', closeCart);
    getGoods(renderCardBasket, showCardBasket);
  }; // вывод товаров по категориям


  var chooseCategory = function chooseCategory(e) {
    e.preventDefault();
    var target = e.target;

    if (target.classList.contains('category-item__all')) {
      // выводим все товары
      getGoods(renderCard, randomSort);
    } else if (target.classList.contains('category-item')) {
      // категрия соответствующая data-атрибуту target
      var currentCategory = target.dataset.category;
      getGoods(renderCard, function (arr) {
        // вернем новый массив с заданной категорией
        return arr.filter(function (item) {
          // у каждого элемента проверяем совпадение категорий
          // у некоторых элементов несколько категорий(лежат в массиве)
          var result = item.category.includes(currentCategory); // вернется true || false

          return result;
        });
      });
    }

    ;
  }; // поиск таваров


  var searchGoods = function searchGoods(e) {
    e.preventDefault(); // получим инпут поля поиска
    // e.target - всегда будет формой
    // получим элементы через form.elements и уже оттуда наш инпут

    var input = e.target.elements.searchGoods;
    var value = input.value.trim();

    if (value !== '') {
      // создадим регулярное выражение для поиска совпадения
      var searchString = new RegExp(value, 'i'); // в фильтр передадим только товары с совпадающим названием

      getGoods(renderCard, function (arr) {
        // в массиве элементов проверим наличие у каждого item.title в searchString
        return arr.filter(function (item) {
          return searchString.test(item.title);
        });
      });
    } else {
      // если поиск по пустой строке
      // подсвечиваем поле ввода search
      search.classList.add('error'); // через 2сек(время анимации) уберем присвоенный класс 

      setTimeout(function () {
        search.classList.remove('error');
      }, 2000);
    } // очищаем поле поиска после рендеринга товаров


    input.value = '';
  }; // функция добавляет и удаляет id из массива избранное


  var toggleWishlist = function toggleWishlist(id, elem) {
    // проверим наличие id товара в массиве избранное
    if (wishlist.includes(id)) {
      // удаляем id из массива
      wishlist.splice(wishlist.indexOf(id), 1); // делаем кнопку(сердечко) неактивной

      elem.classList.remove('active');
    } else {
      // добавим id в массив
      wishlist.push(id); // делаем кнопку(сердечко) активной

      elem.classList.add('active');
    } // обновляем щетчик товаров в избранном


    checkCount(); // сохраняем в local

    storageQuery();
  }; // добавление в корзину


  var addBasket = function addBasket(id) {
    // проверим есть ли товар в объекте 
    if (goodsBasket[id]) {
      // при каждом клике в ключе id добавляем его значению единицу 
      goodsBasket[id] += 1;
    } else {
      // если товара в объекте небыло, тогда значению ключа id присваеваем единицу
      goodsBasket[id] = 1;
    } // обновляем счетчик товаров в корзине


    checkCount(); // сохраняем в cookie

    cookieQuery();
  }; // удаление из элемента из корзины


  var removeGoods = function removeGoods(id) {
    // удалим по id в массиве товаров корзины
    delete goodsBasket[id]; // обновим счетчики

    checkCount(); // обновим куки

    cookieQuery(); // рендер товаров в корзине

    getGoods(renderCardBasket, showCardBasket);
  }; // **
  // **** Хендлеры
  // добавление в избранное из корзины


  var handlerBasket = function handlerBasket(e) {
    var target = e.target; // проверка клика в корзине на кнопку добавить в избранное 

    if (target.classList.contains('goods-add-wishlist')) {
      // 1 параметр - id из дата атрибута в массив избранное
      toggleWishlist(target.dataset.goodsId, target);
    }

    ; // проверка клика в корзине на кнопку удалить из корзины 

    if (target.classList.contains('goods-delete')) {
      // id из дата атрибута в массив избранное
      removeGoods(target.dataset.goodsId);
    }

    ;
  }; // функция обработки клика на товары 


  var handlerGoods = function handlerGoods(e) {
    target = e.target; // проверка клика на кнопку добавить в избранное

    if (target.classList.contains('card-add-wishlist')) {
      // 1 параметр - id из дата атрибута в массив избранное
      toggleWishlist(target.dataset.goodsId, target);
    }

    ;

    if (target.classList.contains('card-add-cart')) {
      // параметр - id из дата атрибута в массив избранное 
      addBasket(target.dataset.goodsId);
    }
  }; // **
  // **** Инициализация 


  {
    getGoods(renderCard, randomSort);
    storageQuery(true);
    cookieQuery(true); // ***** Оработчики

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', chooseCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapper.addEventListener('click', handlerBasket);
    wishlistBtn.addEventListener('click', showWishlist);
  }
});