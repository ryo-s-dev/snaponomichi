/* ------------------------------------------------
   375px 未満は viewport を 375px に固定する
------------------------------------------------ */
(function () {
  const viewport = document.querySelector('meta[name="viewport"]');

  function switchViewport() {
    const value = window.outerWidth > 375 ? 'width=device-width, initial-scale=1.0' : 'width=375';
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }

  window.addEventListener('resize', switchViewport);
  switchViewport();
})();

$(function () {

  /* ------------------------------------------------
     ドロワーメニュー（SP・タブレット）
  ------------------------------------------------ */
  const $drawerIcon = $('#js-drawer-icon');
  const $drawerContent = $('#js-drawer-content');

  function toggleDrawer(open) {
    $drawerIcon.toggleClass('is-checked', open).attr('aria-expanded', open);
    $('body').toggleClass('is-fixed', open);
    if (open) {
      $drawerContent.stop().slideDown(300);
    } else {
      $drawerContent.stop().slideUp(300);
    }
  }

  $drawerIcon.on('click', function () {
    toggleDrawer(!$(this).hasClass('is-checked'));
  });

  $drawerContent.find('a').on('click', function () {
    toggleDrawer(false);
  });

  /* ------------------------------------------------
     キャンペーンについて：写真の無限ループ
     リストを複製して2周分並べ、CSSアニメーションで流す
  ------------------------------------------------ */
  const $loopSlider = $('#js-loop-slider');
  $loopSlider.children().clone().attr('aria-hidden', 'true').appendTo($loopSlider);

  /* ------------------------------------------------
     おすすめスポット：スライダー
  ------------------------------------------------ */
  // ループに必要な枚数を確保するためスライドを複製する
  const $spotsWrap = $('#js-spots-swiper-wrap');
  $spotsWrap.children().clone().appendTo($spotsWrap);

  new Swiper('#js-spots-swiper', {
    loop: true,
    spaceBetween: 16,
    slidesPerView: 1.5273,
    centeredSlides: true,
    keyboard: true,
    navigation: {
      prevEl: '#js-spots-prev',
      nextEl: '#js-spots-next',
    },
    breakpoints: {
      600: {
        slidesPerView: 2,
        centeredSlides: true,
      },
      900: {
        slidesPerView: 2.2,
        centeredSlides: false,
      },
      1200: {
        slidesPerView: 3.2234,
        spaceBetween: 32,
        centeredSlides: false,
      },
    },
  });

  /* ------------------------------------------------
     キャンペーン特典：モーダル（dialog要素）
  ------------------------------------------------ */
  function closeModal(dialog) {
    dialog.close();
    $('html, body').css('overflow', '');
  }

  $('.js-modal-open').on('click', function () {
    const dialog = document.getElementById($(this).data('target'));
    dialog.showModal();
    $('html, body').css('overflow', 'hidden');
  });

  $('.js-modal-close').on('click', function () {
    closeModal($(this).closest('.js-modal')[0]);
  });

  // 背景（モーダルの外側）クリックで閉じる
  $('.js-modal').on('click', function (e) {
    if (e.target === this) {
      closeModal(this);
    }
  });

  // Escキーで閉じたときもスクロールを戻す
  $('.js-modal').on('close', function () {
    $('html, body').css('overflow', '');
  });

  /* ------------------------------------------------
     よくある質問：アコーディオン
  ------------------------------------------------ */
  $('.js-accordion').on('click', function () {
    const isOpen = $(this).hasClass('is-open');
    $(this).toggleClass('is-open', !isOpen).attr('aria-expanded', !isOpen);
    $(this).next().stop().slideToggle(300);
  });

  /* ------------------------------------------------
     お問い合わせフォーム：バリデーション
  ------------------------------------------------ */
  const $form = $('#js-form');
  const $inputs = $form.find('.js-form-input');

  $form.on('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    $inputs.each(function () {
      const valid = this.checkValidity();
      $(this).toggleClass('is-error', !valid);
      if (!valid) isValid = false;
    });

    if (!isValid) {
      $inputs.filter('.is-error').first().trigger('focus');
      return;
    }

    alert('送信完了');
    this.reset();
  });

  $inputs.on('input change', function () {
    if (this.checkValidity()) {
      $(this).removeClass('is-error');
    }
  });

  /* ------------------------------------------------
     ページトップボタン（PCは300pxスクロールで表示）
  ------------------------------------------------ */
  const $pagetop = $('#js-pagetop');
  const pcQuery = window.matchMedia('(min-width: 900px)');

  function updatePagetop() {
    if (!pcQuery.matches) {
      $pagetop.stop(true, true).css('display', '');
      return;
    }
    if ($(window).scrollTop() > 300) {
      $pagetop.stop(true, true).fadeIn();
    } else {
      $pagetop.stop(true, true).fadeOut();
    }
  }

  $(window).on('scroll', updatePagetop);
  pcQuery.addEventListener('change', updatePagetop);

  $pagetop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
  });

  /* ------------------------------------------------
     スムーススクロール（固定ヘッダーの高さを引く）
  ------------------------------------------------ */
  $('a[href^="#"]').on('click', function (e) {
    const href = $(this).attr('href');
    const $target = href === '#' ? $('html') : $(href);
    if (!$target.length) return;
    e.preventDefault();

    const headerHeight = $('#js-header').outerHeight() || 0;
    const position = href === '#' ? 0 : Math.max($target.offset().top - headerHeight, 0);

    $('html, body').animate({ scrollTop: position }, 500, 'swing');
  });

});
