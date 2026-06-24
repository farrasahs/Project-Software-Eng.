let isSignUpMode = false;

document.addEventListener("DOMContentLoaded", function () {
    const btnSwitchAuth = document.getElementById('btn-switch-auth');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const btnAuthSubmit = document.getElementById('btn-auth-submit');
    const authSwitchText = document.getElementById('auth-switch-text');
    const groupConfirmPassword = document.getElementById('group-confirm-password');
    const formAuth = document.getElementById('form-auth');
    const bottomNav = document.querySelector('.bottom-nav');

    navigasi('auth'); 
    if (bottomNav) bottomNav.classList.add('hidden');

    if (btnSwitchAuth) {
        btnSwitchAuth.addEventListener('click', function (e) {
            e.preventDefault();
            isSignUpMode = !isSignUpMode;

            if (isSignUpMode) {
                authTitle.innerText = "SIGN UP";
                authSubtitle.innerText = "Create your business account to get started.";
                btnAuthSubmit.innerText = "Sign Up";
                authSwitchText.innerHTML = `Already have an account? <a href="#" id="btn-switch-auth">Sign In</a>`;
                groupConfirmPassword.classList.remove('hidden');
                document.getElementById('auth-confirm-password').setAttribute('required', 'required');
            } else {
                authTitle.innerText = "SIGN IN";
                authSubtitle.innerText = "Welcome back! Please enter your details.";
                btnAuthSubmit.innerText = "Sign In";
                authSwitchText.innerHTML = `Don't have an account? <a href="#" id="btn-switch-auth">Sign Up</a>`;
                groupConfirmPassword.classList.add('hidden');
                document.getElementById('auth-confirm-password').removeAttribute('required');
            }
            
            document.getElementById('btn-switch-auth').addEventListener('click', arguments.callee);
        });
    }

    if (formAuth) {
        formAuth.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const bottomNav = document.querySelector('.bottom-nav');

            if (isSignUpMode) {
                const confirmPassword = document.getElementById('auth-confirm-password').value;

                if (password !== confirmPassword) {
                    alert("Password dan Konfirmasi Password tidak cocok!");
                    return;
                }

                const userBaru = { email: email, password: password };
                localStorage.setItem('user_umkm_account', JSON.stringify(userBaru));
                
                alert("Registrasi Berhasil! Silakan masuk dengan akun baru Anda.");
                LolosLogin();
            } else {
                const dataUserTerdaftar = JSON.parse(localStorage.getItem('user_umkm_account'));

                if (!dataUserTerdaftar && email === "admin@gmail.com" && password === "admin123") {
                    LolosLogin();
                } else if (dataUserTerdaftar && email === dataUserTerdaftar.email && password === dataUserTerdaftar.password) {
                    LolosLogin();
                } else {
                    alert("Email atau Password salah! (Gunakan admin@gmail.com / admin123 jika belum mendaftar)");
                }
            }
        });
    }

    function LolosLogin() {
    alert("Berhasil Masuk!");
    
    const emailInput = document.getElementById('auth-email').value;
    sessionStorage.setItem('user_aktif', emailInput);
    
    const welcomeBanner = document.querySelector('#page-home .welcome-banner');
    if (welcomeBanner) welcomeBanner.classList.remove('hidden');

    navigasi('home'); 
}
});

let databaseProduk = JSON.parse(localStorage.getItem('produk_umkm'));
if (!databaseProduk) {
    databaseProduk = [
        { id: 1, nama: "Product 1", save: "Save", no: "No" },
        { id: 2, nama: "Product 2", save: "Save", no: "No" }
    ];
    localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
}

let idProdukTerpilih = null; 

function navigasi(namaHalaman) {
    const semuaHalaman = document.querySelectorAll('.app-page');
    semuaHalaman.forEach(page => page.classList.add('hidden'));

    const targetPage = document.getElementById('page-' + namaHalaman);
    if (targetPage) targetPage.classList.remove('hidden');

    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        if (namaHalaman === 'auth') {
            bottomNav.classList.add('hidden');
        } else {
            bottomNav.classList.remove('hidden');
        }
    }

    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if (namaHalaman === 'home' && navItems[0]) navItems[0].classList.add('active');
    if (namaHalaman === 'list' && navItems[1]) navItems[1].classList.add('active');
    if (namaHalaman === 'scan' && navItems[2]) navItems[2].classList.add('active');
    if (namaHalaman === 'statis' && navItems[3]) navItems[3].classList.add('active');
    if (namaHalaman === 'profile' && navItems[4]) navItems[4].classList.add('active');

    if (namaHalaman === 'list') {
        tampilkanDataInventory();
    }

    if (namaHalaman === 'profile') {
        const userAktif = sessionStorage.getItem('user_aktif'); 
        
        if (userAktif) {
            const usernameClean = userAktif.split('@')[0]; 
            const namaClean = usernameClean.charAt(0).toUpperCase() + usernameClean.slice(1);

            const txtName = document.getElementById('profile-name');
            const txtUsername = document.getElementById('profile-username');

            if (txtName) txtName.innerText = namaClean;
            if (txtUsername) txtUsername.innerText = "@" + usernameClean.toLowerCase();
        }
    }
}

function tampilkanDataInventory() {
    const containerProduk = document.querySelector('.products-list');
    if (!containerProduk) return;

    containerProduk.innerHTML = "";

    databaseProduk.forEach(produk => {
        const itemHTML = `
            <div class="product-item">
                <div class="product-box-img"><i class="fa-solid fa-image"></i></div>
                <div class="product-info">
                    <h4>${produk.nama}</h4>
                    <span class="badge-save">${produk.save}</span> 
                    <span class="badge-no">${produk.no}</span>
                </div>
                <button class="btn-edit" onclick="bukaModalPilihan(${produk.id}, '${produk.nama}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </div>
        `;
        containerProduk.insertAdjacentHTML('beforeend', itemHTML);
    });
}

function bukaModalPilihan(id, nama) {
    idProdukTerpilih = id;
    document.getElementById('pilihan-judul-produk').innerText = nama;
    document.getElementById('modal-pilihan').classList.remove('hidden');
}

function tutupModalPilihan() {
    document.getElementById('modal-pilihan').classList.add('hidden');
}

document.getElementById('btn-pilihan-edit').addEventListener('click', function() {
    const produk = databaseProduk.find(p => p.id === idProdukTerpilih);
    if (produk) {
        document.getElementById('input-nama').value = produk.nama;
        document.getElementById('input-save').value = produk.save;
        document.getElementById('input-no').value = produk.no;
        tutupModalPilihan();
        bukaModal(); 
    }
});

document.getElementById('btn-pilihan-hapus').addEventListener('click', function() {
    tutupModalPilihan();
    if (confirm("Apakah kamu yakin ingin menghapus produk ini?")) {
        databaseProduk = databaseProduk.filter(p => p.id !== idProdukTerpilih);
        localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
        tampilkanDataInventory();
    }
});

function bukaModal() {
    const modal = document.getElementById('modal-produk');
    if (modal) modal.classList.remove('hidden');
}

function tutupModal() {
    const modal = document.getElementById('modal-produk');
    const form = document.getElementById('form-produk');
    if (modal) modal.classList.add('hidden');
    if (form) form.reset();
    idProdukTerpilih = null;
}

document.addEventListener("DOMContentLoaded", function () {
    
    const scanBanner = document.getElementById('scan-trigger');
    const bannerContent = document.getElementById('banner-status-content');
    const cameraPreview = document.getElementById('camera-preview');
    let html5QrCodeInventory = null;

    if (scanBanner) {
        scanBanner.addEventListener('click', function (e) {
            if (e.target.closest('#camera-preview')) return;

            if (!html5QrCodeInventory) {
                html5QrCodeInventory = new Html5QrCode("camera-preview");
                html5QrCodeInventory.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 150 } },
                    (decodedText) => {
                        alert("🎉 Barcode Inventory Terdeteksi: " + decodedText);
                        html5QrCodeInventory.stop().then(() => {
                            html5QrCodeInventory = null;
                            cameraPreview.style.display = 'none';
                            bannerContent.style.display = 'flex';
                        });
                    },
                    (err) => {}
                ).then(() => {
                    bannerContent.style.display = 'none'; 
                    cameraPreview.style.display = 'block';
                }).catch(err => {
                    console.error(err);
                    cameraPreview.style.display = 'none';
                    bannerContent.style.display = 'flex';
                    html5QrCodeInventory = null;
                });
            }
        });
    }

    const scanCartTrigger = document.getElementById('scan-cart-trigger');
    const cartBannerContent = document.getElementById('cart-banner-content');
    const cameraCartPreview = document.getElementById('camera-cart-preview');
    let html5QrCodeCart = null;

    if (scanCartTrigger) {
        scanCartTrigger.addEventListener('click', function (e) {
            if (e.target.closest('#camera-cart-preview')) return;

            if (!html5QrCodeCart) {
                html5QrCodeCart = new Html5QrCode("camera-cart-preview");
                
                html5QrCodeCart.start(
                    { facingMode: "environment" }, 
                    { fps: 10, qrbox: { width: 200, height: 140 } },
                    (decodedText) => {
                        alert("🛒 Produk Masuk Keranjang: " + decodedText);
                        html5QrCodeCart.stop().then(() => {
                            html5QrCodeCart = null;
                            cameraCartPreview.style.display = 'none';
                            cartBannerContent.style.display = 'flex';
                            scanCartTrigger.style.height = "180px";
                        });
                    },
                    (err) => {}
                ).then(() => {
                    cartBannerContent.style.display = 'none';
                    cameraCartPreview.style.display = 'block';
                    scanCartTrigger.style.height = "auto";
                    scanCartTrigger.style.minHeight = "180px";
                }).catch(err => {
                    console.error("Gagal membuka kamera: ", err);
                    alert("Akses kamera gagal! Pastikan memakai Live Server VS Code / HTTPS, dan izinkan permission webcam.");
                    cameraCartPreview.style.display = 'none';
                    cartBannerContent.style.display = 'flex';
                    scanCartTrigger.style.height = "180px";
                    html5QrCodeCart = null;
                });
            }
        });
    }
});

window.onload = function() {
    navigasi('auth');
    tampilkanDataInventory();
    
    const formProduk = document.getElementById('form-produk');
    if (formProduk) {
        formProduk.addEventListener('submit', function(e) {
            e.preventDefault();

            const namaVal = document.getElementById('input-nama').value;
            const saveVal = document.getElementById('input-save').value;
            const noVal = document.getElementById('input-no').value;

            if (idProdukTerpilih) {
                databaseProduk = databaseProduk.map(p => {
                    if (p.id === idProdukTerpilih) {
                        return { id: p.id, nama: namaVal, save: saveVal, no: noVal };
                    }
                    return p;
                });
            } else {
                const produkBaru = { id: Date.now(), nama: namaVal, save: saveVal, no: noVal };
                databaseProduk.push(produkBaru);
            }

            localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
            
            tutupModal();
            alert("Produk berhasil disimpan!");
            navigasi('list');
        });
    }
};

let isSignUpMode = false;

document.addEventListener("DOMContentLoaded", function () {
    const btnSwitchAuth = document.getElementById('btn-switch-auth');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const btnAuthSubmit = document.getElementById('btn-auth-submit');
    const authSwitchText = document.getElementById('auth-switch-text');
    const groupConfirmPassword = document.getElementById('group-confirm-password');
    const formAuth = document.getElementById('form-auth');
    const bottomNav = document.querySelector('.bottom-nav');

    navigasi('auth'); 
    if (bottomNav) bottomNav.classList.add('hidden');

    if (btnSwitchAuth) {
        btnSwitchAuth.addEventListener('click', function (e) {
            e.preventDefault();
            isSignUpMode = !isSignUpMode;

            if (isSignUpMode) {
                authTitle.innerText = "SIGN UP";
                authSubtitle.innerText = "Create your business account to get started.";
                btnAuthSubmit.innerText = "Sign Up";
                authSwitchText.innerHTML = `Already have an account? <a href="#" id="btn-switch-auth">Sign In</a>`;
                groupConfirmPassword.classList.remove('hidden');
                document.getElementById('auth-confirm-password').setAttribute('required', 'required');
            } else {
                authTitle.innerText = "SIGN IN";
                authSubtitle.innerText = "Welcome back! Please enter your details.";
                btnAuthSubmit.innerText = "Sign In";
                authSwitchText.innerHTML = `Don't have an account? <a href="#" id="btn-switch-auth">Sign Up</a>`;
                groupConfirmPassword.classList.add('hidden');
                document.getElementById('auth-confirm-password').removeAttribute('required');
            }
            
            // Re-bind event listener karena innerHTML di-refresh
            document.getElementById('btn-switch-auth').addEventListener('click', arguments.callee);
        });
    }

    // SUBMIT FORM DATA (PROSES LOGIN / DAFTAR)
    if (formAuth) {
        formAuth.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const bottomNav = document.querySelector('.bottom-nav');

            if (isSignUpMode) {
                // === PROSES SIGN UP ===
                const confirmPassword = document.getElementById('auth-confirm-password').value;

                if (password !== confirmPassword) {
                    alert("Password dan Konfirmasi Password tidak cocok!");
                    return;
                }

                // Simpan user baru ke localStorage
                const userBaru = { email: email, password: password };
                localStorage.setItem('user_umkm_account', JSON.stringify(userBaru));
                
                alert("Registrasi Berhasil! Silakan masuk dengan akun baru Anda.");
                // Kembalikan ke mode Sign In
                LolosLogin();
                /*btnSwitchAuth.click();*/
            } else {
                // === PROSES SIGN IN ===
                const dataUserTerdaftar = JSON.parse(localStorage.getItem('user_umkm_account'));

                // Akun default jika belum pernah daftar: admin@gmail.com / admin123
                if (!dataUserTerdaftar && email === "admin@gmail.com" && password === "admin123") {
                    LolosLogin();
                } else if (dataUserTerdaftar && email === dataUserTerdaftar.email && password === dataUserTerdaftar.password) {
                    LolosLogin();
                } else {
                    alert("Email atau Password salah! (Gunakan admin@gmail.com / admin123 jika belum mendaftar)");
                }
            }
        });
    }

    function LolosLogin() {
    alert("Berhasil Masuk!");
    
    // 1. Munculkan kembali bottom navigation bar
    /*const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) bottomNav.classList.remove('hidden'); */
    const emailInput = document.getElementById('auth-email').value;
    sessionStorage.setItem('user_aktif', emailInput);
    
    // 2. Munculkan kembali banner WELCOME di halaman utama
    const welcomeBanner = document.querySelector('#page-home .welcome-banner');
    if (welcomeBanner) welcomeBanner.classList.remove('hidden');

    // 3. Alihkan halaman ke beranda utama
    navigasi('home'); 
}
});

// ==================== 1. INISIALISASI DATABASE LOCALSTORAGE ====================
let databaseProduk = JSON.parse(localStorage.getItem('produk_umkm'));
if (!databaseProduk) {
    databaseProduk = [
        { id: 1, nama: "Product 1", save: "Save", no: "No" },
        { id: 2, nama: "Product 2", save: "Save", no: "No" }
    ];
    localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
}

let idProdukTerpilih = null; 

// ==================== 2. FUNGSI NAVIGASI HALAMAN SPA ====================
function navigasi(namaHalaman) {
    const semuaHalaman = document.querySelectorAll('.app-page');
    semuaHalaman.forEach(page => page.classList.add('hidden'));

    const targetPage = document.getElementById('page-' + namaHalaman);
    if (targetPage) targetPage.classList.remove('hidden');

    // Kendali utama visibilitas navigasi bawah (Terpusat)
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        if (namaHalaman === 'auth') {
            bottomNav.classList.add('hidden');
        } else {
            bottomNav.classList.remove('hidden');
        }
    }

    // Set status tombol navigasi aktif
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    if (namaHalaman === 'home' && navItems[0]) navItems[0].classList.add('active');
    if (namaHalaman === 'list' && navItems[1]) navItems[1].classList.add('active');
    if (namaHalaman === 'scan' && navItems[2]) navItems[2].classList.add('active');
    if (namaHalaman === 'statis' && navItems[3]) navItems[3].classList.add('active');
    if (namaHalaman === 'profile' && navItems[4]) navItems[4].classList.add('active');

    // --- LOGIKA MENAMPILKAN DATA INVENTORY ---
    if (namaHalaman === 'list') {
        tampilkanDataInventory();
    }

    // --- LOGIKA BARU: UPDATE NAMA & USERNAME DI PROFILE ---
    if (namaHalaman === 'profile') {
        const userAktif = sessionStorage.getItem('user_aktif'); // Ambil email user login
        
        if (userAktif) {
            // Misal email: "budi.sukses@gmail.com" -> diambil "budi.sukses" saja
            const usernameClean = userAktif.split('@')[0]; 
            // Ubah huruf pertamanya jadi kapital untuk Nama ("Budi.sukses")
            const namaClean = usernameClean.charAt(0).toUpperCase() + usernameClean.slice(1);

            // Tembak ke HTML
            const txtName = document.getElementById('profile-name');
            const txtUsername = document.getElementById('profile-username');

            if (txtName) txtName.innerText = namaClean;
            if (txtUsername) txtUsername.innerText = "@" + usernameClean.toLowerCase();
        }
    }
}

// ==================== 3. FUNGSI RENDER DATA INVENTORY ====================
function tampilkanDataInventory() {
    const containerProduk = document.querySelector('.products-list');
    if (!containerProduk) return;

    containerProduk.innerHTML = "";

    databaseProduk.forEach(produk => {
        // Berikan fallback 'Available' jika properti stok belum ada di data tersebut
        const statusStok = produk.stok || "Available";
        const statusClass = statusStok === "Available" ? "badge-available" : "badge-empty";

        const itemHTML = `
            <div class="product-item">
                <div class="product-box-img"><i class="fa-solid fa-image"></i></div>
                <div class="product-info">
                    <h4>${produk.nama}</h4>
                    <span class="badge-save">${produk.save}</span> 
                    <span class="badge-stok ${statusClass}">${statusStok}</span>
                </div>
                <button class="btn-edit" onclick="bukaModalPilihan(${produk.id}, '${produk.nama}')">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </div>
        `;
        containerProduk.insertAdjacentHTML('beforeend', itemHTML);
    });
}

// ==================== 4. LOGIKA MODAL (EDIT & HAPUS) ====================
function bukaModalPilihan(id, nama) {
    idProdukTerpilih = id;
    document.getElementById('pilihan-judul-produk').innerText = nama;
    document.getElementById('modal-pilihan').classList.remove('hidden');
}

function tutupModalPilihan() {
    document.getElementById('modal-pilihan').classList.add('hidden');
}

// Cari event listener tombol edit pilihan lalu sesuaikan:
document.getElementById('btn-pilihan-edit').addEventListener('click', function() {
    const produk = databaseProduk.find(p => p.id === idProdukTerpilih);
    if (produk) {
        document.getElementById('input-nama').value = produk.nama;
        document.getElementById('input-save').value = produk.save;
                
        tutupModalPilihan();
        bukaModal(); 
    }
});

document.getElementById('btn-pilihan-hapus').addEventListener('click', function() {
    tutupModalPilihan();
    if (confirm("Apakah kamu yakin ingin menghapus produk ini?")) {
        databaseProduk = databaseProduk.filter(p => p.id !== idProdukTerpilih);
        localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
        tampilkanDataInventory();
    }
});

function bukaModal() {
    const modal = document.getElementById('modal-produk');
    if (modal) modal.classList.remove('hidden');
}

function tutupModal() {
    const modal = document.getElementById('modal-produk');
    const form = document.getElementById('form-produk');
    if (modal) modal.classList.add('hidden');
    if (form) form.reset();
    idProdukTerpilih = null; // <-- SUDAH DI-FIX DI SINI (Bebas typo)
}

// ==================== 5. LIVE SCANNER (INVENTORY & CART TRANSACTIONS) ====================
document.addEventListener("DOMContentLoaded", function () {
    
    // --- SCANNER 1: HALAMAN INVENTORY ---
    const scanBanner = document.getElementById('scan-trigger');
    const bannerContent = document.getElementById('banner-status-content');
    const cameraPreview = document.getElementById('camera-preview');
    let html5QrCodeInventory = null;

    if (scanBanner) {
        scanBanner.addEventListener('click', function (e) {
            if (e.target.closest('#camera-preview')) return;

            if (!html5QrCodeInventory) {
                html5QrCodeInventory = new Html5QrCode("camera-preview");
                html5QrCodeInventory.start(
                    { facingMode: {exact : "environment"}},
                    { fps: 10, qrbox: { width: 250, height: 150 } },
                    (decodedText) => {
                        alert("🎉 Barcode Inventory Terdeteksi: " + decodedText);
                        html5QrCodeInventory.stop().then(() => {
                            html5QrCodeInventory = null;
                            cameraPreview.style.display = 'none';
                            bannerContent.style.display = 'flex';
                        });
                    },
                    (err) => {}
                ).then(() => {
                    bannerContent.style.display = 'none'; 
                    cameraPreview.style.display = 'block';
                }).catch(err => {
                    console.error(err);
                    cameraPreview.style.display = 'none';
                    bannerContent.style.display = 'flex';
                    html5QrCodeInventory = null;
                });
            }
        });
    }

    // --- SCANNER 2: HALAMAN CART / TRANSACTIONS ---
    const scanCartTrigger = document.getElementById('scan-cart-trigger');
    const cartBannerContent = document.getElementById('cart-banner-content');
    const cameraCartPreview = document.getElementById('camera-cart-preview');
    let html5QrCodeCart = null;

    if (scanCartTrigger) {
        scanCartTrigger.addEventListener('click', function (e) {
            if (e.target.closest('#camera-cart-preview')) return;

            if (!html5QrCodeCart) {
                html5QrCodeCart = new Html5QrCode("camera-cart-preview");
                
                html5QrCodeCart.start(
                    { facingMode: "environment" }, 
                    { fps: 10, qrbox: { width: 200, height: 140 } },
                    (decodedText) => {
                        alert("🛒 Produk Masuk Keranjang: " + decodedText);
                        html5QrCodeCart.stop().then(() => {
                            html5QrCodeCart = null;
                            cameraCartPreview.style.display = 'none';
                            cartBannerContent.style.display = 'flex';
                            scanCartTrigger.style.height = "180px";
                        });
                    },
                    (err) => {}
                ).then(() => {
                    cartBannerContent.style.display = 'none';
                    cameraCartPreview.style.display = 'block';
                    scanCartTrigger.style.height = "auto";
                    scanCartTrigger.style.minHeight = "180px";
                }).catch(err => {
                    console.error("Gagal membuka kamera: ", err);
                    alert("Akses kamera gagal! Pastikan memakai Live Server VS Code / HTTPS, dan izinkan permission webcam.");
                    cameraCartPreview.style.display = 'none';
                    cartBannerContent.style.display = 'flex';
                    scanCartTrigger.style.height = "180px";
                    html5QrCodeCart = null;
                });
            }
        });
    }
});

// ==================== 6. EKSEKUSI UTAMA (WINDOW ONLOAD) ====================
window.onload = function() {
    navigasi('auth');
    tampilkanDataInventory();
    
    const formProduk = document.getElementById('form-produk');
    if (formProduk) {
        // Di dalam fungsi Window Onload (Bagian submit form-produk)
formProduk.addEventListener('submit', function(e) {
    e.preventDefault();

    const namaVal = document.getElementById('input-nama').value;
    const saveVal = document.getElementById('input-save').value;
    
    const stokVal = "Available"; 

    if (idProdukTerpilih) {
        // Mode Update / Edit produk
        databaseProduk = databaseProduk.map(p => {
            if (p.id === idProdukTerpilih) {
                return { id: p.id, nama: namaVal, save: saveVal, stok: p.stok || "Available" };
            }
            return p;
        });
    } else {
        // Mode Create / Input produk baru otomatis "Available"
        const produkBaru = { id: Date.now(), nama: namaVal, save: saveVal, stok: stokVal };
        databaseProduk.push(produkBaru);
    }

    localStorage.setItem('produk_umkm', JSON.stringify(databaseProduk));
    
    tutupModal();
    alert("Produk berhasil disimpan!");
    navigasi('list');
});
    }
};
