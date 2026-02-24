document.addEventListener('DOMContentLoaded', function() {
    // 現在の階層を判定（style.cssへのパスから推測）
    let rootPath = '';
    const cssLink = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
    if (cssLink) {
        const href = cssLink.getAttribute('href');
        if (href.indexOf('../') === 0) {
            rootPath = '../';
        }
    }

    // FontAwesomeの読み込み (存在しない場合)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // ヘッダーHTML
    const headerHTML = `
        <div class="header-container">
            <div class="site-branding">
                <h1 class="logo">
                    <a href="${rootPath}index.html">
                        <img src="${rootPath}images/整う君.webp" alt="サウナデツナガル" class="logo-img">
                    </a>
                </h1>
                <p class="logo-sub">1分で見つかる気持ちいいサウナ</p>
            </div>
            <button class="hamburger-menu" aria-label="メニューを開く">
                <span></span>
            </button>
            <nav class="global-nav">
                <ul class="nav-list">
                    <li><a href="${rootPath}ranking.html">ランキング</a></li>
                    <li><a href="${rootPath}index.html#feature">サウナ特集</a></li>
                    <li><a href="${rootPath}reservation.html">予約</a></li>
                    <li><a href="${rootPath}shop.html">グッズ</a></li>
                    <li><a href="${rootPath}index.html#special">Special Contents</a></li>
                    <li><a href="${rootPath}profile.html">プロフィール</a></li>
                    <li><a href="${rootPath}contact.html">問い合わせ</a></li>
                    <li>
                        <a href="${rootPath}cart.html" class="nav-cart-wrap" aria-label="カート">
                            <i class="fas fa-shopping-cart"></i>
                            <span id="cart-badge" class="cart-badge"></span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    `;

    // プロモーションバナーHTML
    const promoBannerHTML = `
        <div class="promo-banner">
            <a href="${rootPath}ranking.html">
                <span class="promo-badge">Check!</span>
                今行くべきサウナはここだ！最新ランキング公開中 👑
            </a>
        </div>
    `;

    // フッターHTML
    const footerHTML = `
        <div class="footer-container">
            <nav class="footer-nav">
                <ul>
                    <li><a href="${rootPath}ranking.html">ランキング</a></li>
                    <li><a href="${rootPath}index.html#feature">サウナ特集</a></li>
                    <li><a href="${rootPath}reservation.html">予約</a></li>
                    <li><a href="${rootPath}shop.html">グッズ</a></li>
                    <li><a href="${rootPath}index.html#special">Special Contents</a></li>
                    <li><a href="${rootPath}profile.html">プロフィール</a></li>
                    <li><a href="${rootPath}contact.html">問い合わせ</a></li>
                    <li><a href="${rootPath}admin.html" style="font-size:0.8rem; opacity:0.7;">管理者ログイン</a></li>
                </ul>
            </nav>
            <p class="copyright">&copy; 2026 サウナデツナガル</p>
        </div>
    `;

    // HTMLの挿入
    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = headerHTML;
        // ヘッダーの直後にバナーを挿入
        header.insertAdjacentHTML('afterend', promoBannerHTML);
    }

    const footer = document.querySelector('footer');
    if (footer) footer.innerHTML = footerHTML;

    // ハンバーガーメニューの動作設定
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.global-nav');
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // カートバッジの更新関数をグローバルに定義
    window.updateCartBadge = function() {
        const cart = JSON.parse(localStorage.getItem('tokyoSaunaCart')) || [];
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        const badge = document.getElementById('cart-badge');
        
        if (badge) {
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    };

    // 初期表示時にバッジ更新
    window.updateCartBadge();
});