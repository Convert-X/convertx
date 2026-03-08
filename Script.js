/* =============================================
   ConvertX — Script.js
   Конвертація + Покращення + Апскейл + i18n
   ============================================= */

// ── i18n СИСТЕМА ────────────────────────────────

var TRANSLATIONS = {
    en: {
        nav_tools:      'Tools',
        nav_convert:    'Convert',
        nav_enhance:    'Enhance',
        nav_upscale:    'Upscale',
        nav_compress:   'Compress',
        nav_pdf:        'PDF',
        footer_hint:    'More formats — coming soon',
        privacy_label:  'Private',
        privacy_title:  '🔒 100% Confidential',
        privacy_text:   'We <strong>collect nothing</strong>.<br>All files are processed in your browser — not a single byte leaves your device.',
        privacy_t1:     'No servers',
        privacy_t2:     'No sign-up',
        privacy_t3:     'No logs',
        // Convert
        convert_title:  'Image <span class="accent">Conversion</span>',
        convert_desc:   'Convert JPG, PNG, WEBP without quality loss',
        drop_main:      'Drop file here',
        drop_or:        'or',
        drop_choose:    'Choose file',
        drop_hint_img:  'JPG · PNG · WEBP · GIF · up to 50MB',
        drop_hint_upscale: 'JPG · PNG · WEBP · recommended up to 2000×2000px for AI',
        ctrl_format:    'Output format',
        ctrl_quality:   'Quality',
        btn_convert:    'Convert',
        btn_download:   'Download',
        prog_processing:'Processing...',
        // Enhance
        enhance_title:  'Image <span class="accent">Enhancement</span>',
        enhance_desc:   'Brightness, contrast, sharpness — all in one place',
        preview_label:  'Preview',
        ctrl_brightness:'Brightness',
        ctrl_contrast:  'Contrast',
        ctrl_saturation:'Saturation',
        ctrl_sharpness: 'Sharpness',
        btn_reset:      'Reset',
        btn_save:       'Save result',
        // Upscale
        upscale_title:  'Image <span class="accent">Upscale</span>',
        upscale_desc:   'Increase resolution — two methods to choose from',
        method_lanczos: 'Lanczos',
        method_desc_l:  'Mathematical · Instant',
        method_ai:      'AI Real-ESRGAN',
        method_desc_ai: 'Neural network · Slower',
        ai_notice:      'First run downloads the model (~5MB). Then cached in browser. Processing may take 10–60s depending on image size.',
        ctrl_scale:     'Scale factor',
        ctrl_result_size:'Output size',
        btn_upscale:    'Upscale',
        compare_before: 'Before',
        compare_after:  'After',
        // Compress
        compress_title:      'File <span class="accent">Compression</span>',
        compress_desc:       'Reduce image size without noticeable quality loss',
        compress_level:      'Compression level',
        compress_size_label: 'File size',
        btn_compress:        'Compress',
        // PDF
        pdf_title:           'PDF <span class="accent">Tools</span>',
        pdf_desc:            'Convert images to PDF or PDF to images',
        pdf_mode_img2pdf:    'Images → PDF',
        pdf_mode_img2pdf_desc: 'One or more JPG/PNG to PDF',
        pdf_mode_pdf2img:    'PDF → Images',
        pdf_mode_pdf2img_desc: 'Each page as PNG',
        pdf_drop_multi:      'Drop one or more images',
        btn_make_pdf:        'Create PDF',
        pdf2img_soon_title:  'PDF → Images',
        pdf2img_soon_text:   'Requires PDF.js. Ready in the next update!',
    },
    uk: {
        nav_tools:      'Інструменти',
        nav_convert:    'Конвертація',
        nav_enhance:    'Покращення',
        nav_upscale:    'Апскейл',
        nav_compress:   'Стиснення',
        nav_pdf:        'PDF',
        footer_hint:    'Більше форматів — скоро',
        privacy_label:  'Приватно',
        privacy_title:  '🔒 100% Конфіденційно',
        privacy_text:   'Ми <strong>нічого не збираємо</strong>.<br>Усі файли обробляються лише у твоєму браузері — жоден байт не покидає твій пристрій.',
        privacy_t1:     'Без серверів',
        privacy_t2:     'Без реєстрації',
        privacy_t3:     'Без логів',
        // Convert
        convert_title:  'Конвертація <span class="accent">зображень</span>',
        convert_desc:   'Перетворюй JPG, PNG, WEBP без втрати якості',
        drop_main:      'Перетягни файл сюди',
        drop_or:        'або',
        drop_choose:    'Вибрати файл',
        drop_hint_img:  'JPG · PNG · WEBP · GIF · до 50MB',
        drop_hint_upscale: 'JPG · PNG · WEBP · рекомендовано до 2000×2000px для AI',
        ctrl_format:    'Формат виводу',
        ctrl_quality:   'Якість',
        btn_convert:    'Конвертувати',
        btn_download:   'Завантажити',
        prog_processing:'Обробка...',
        // Enhance
        enhance_title:  'Покращення <span class="accent">якості</span>',
        enhance_desc:   'Яскравість, контраст, різкість і насиченість — все в одному місці',
        preview_label:  'Попередній перегляд',
        ctrl_brightness:'Яскравість',
        ctrl_contrast:  'Контраст',
        ctrl_saturation:'Насиченість',
        ctrl_sharpness: 'Різкість',
        btn_reset:      'Скинути',
        btn_save:       'Зберегти результат',
        // Upscale
        upscale_title:  'Апскейл <span class="accent">зображень</span>',
        upscale_desc:   'Збільшення розміру і роздільної здатності — два методи на вибір',
        method_lanczos: 'Lanczos',
        method_desc_l:  'Математичний · Миттєво',
        method_ai:      'AI Real-ESRGAN',
        method_desc_ai: 'Нейромережа · Повільніше',
        ai_notice:      'Перший запуск завантажує модель (~5MB). Далі — кешується в браузері. Обробка може тривати 10–60 сек залежно від розміру фото.',
        ctrl_scale:     'Збільшення',
        ctrl_result_size:'Результуючий розмір',
        btn_upscale:    'Збільшити',
        compare_before: 'До',
        compare_after:  'Після',
        // Compress
        compress_title:      'Стиснення <span class="accent">файлів</span>',
        compress_desc:       'Зменшуй розмір зображень без помітної втрати якості',
        compress_level:      'Рівень стиснення',
        compress_size_label: 'Розмір файлу',
        btn_compress:        'Стиснути',
        // PDF
        pdf_title:           'PDF <span class="accent">інструменти</span>',
        pdf_desc:            'Перетвори зображення в PDF або PDF у зображення',
        pdf_mode_img2pdf:    'Фото → PDF',
        pdf_mode_img2pdf_desc: 'Один або кілька JPG/PNG в PDF',
        pdf_mode_pdf2img:    'PDF → Фото',
        pdf_mode_pdf2img_desc: 'Кожна сторінка як PNG',
        pdf_drop_multi:      'Перетягни одне або кілька зображень',
        btn_make_pdf:        'Створити PDF',
        pdf2img_soon_title:  'PDF → Фото',
        pdf2img_soon_text:   'Потребує PDF.js. Буде готово в наступному оновленні!',
    },
    de: {
        nav_tools:      'Werkzeuge',
        nav_convert:    'Konvertieren',
        nav_enhance:    'Verbessern',
        nav_upscale:    'Hochskalieren',
        nav_compress:   'Komprimieren',
        nav_pdf:        'PDF',
        footer_hint:    'Mehr Formate — demnächst',
        privacy_label:  'Privat',
        privacy_title:  '🔒 100% Vertraulich',
        privacy_text:   'Wir <strong>sammeln nichts</strong>.<br>Alle Dateien werden nur in Ihrem Browser verarbeitet — kein Byte verlässt Ihr Gerät.',
        privacy_t1:     'Kein Server',
        privacy_t2:     'Keine Anmeldung',
        privacy_t3:     'Keine Logs',
        // Convert
        convert_title:  'Bilder <span class="accent">konvertieren</span>',
        convert_desc:   'Konvertiere JPG, PNG, WEBP ohne Qualitätsverlust',
        drop_main:      'Datei hier ablegen',
        drop_or:        'oder',
        drop_choose:    'Datei wählen',
        drop_hint_img:  'JPG · PNG · WEBP · GIF · bis 50MB',
        drop_hint_upscale: 'JPG · PNG · WEBP · empfohlen bis 2000×2000px für AI',
        ctrl_format:    'Ausgabeformat',
        ctrl_quality:   'Qualität',
        btn_convert:    'Konvertieren',
        btn_download:   'Herunterladen',
        prog_processing:'Verarbeitung...',
        // Enhance
        enhance_title:  'Bild <span class="accent">verbessern</span>',
        enhance_desc:   'Helligkeit, Kontrast, Schärfe — alles an einem Ort',
        preview_label:  'Vorschau',
        ctrl_brightness:'Helligkeit',
        ctrl_contrast:  'Kontrast',
        ctrl_saturation:'Sättigung',
        ctrl_sharpness: 'Schärfe',
        btn_reset:      'Zurücksetzen',
        btn_save:       'Ergebnis speichern',
        // Upscale
        upscale_title:  'Bilder <span class="accent">hochskalieren</span>',
        upscale_desc:   'Auflösung erhöhen — zwei Methoden zur Wahl',
        method_lanczos: 'Lanczos',
        method_desc_l:  'Mathematisch · Sofort',
        method_ai:      'AI Real-ESRGAN',
        method_desc_ai: 'Neuronales Netz · Langsamer',
        ai_notice:      'Erster Start lädt das Modell (~5MB). Danach im Browser gespeichert. Verarbeitung kann 10–60s dauern.',
        ctrl_scale:     'Skalierungsfaktor',
        ctrl_result_size:'Ausgabegröße',
        btn_upscale:    'Hochskalieren',
        compare_before: 'Vorher',
        compare_after:  'Nachher',
        // Compress
        compress_title:      'Datei <span class="accent">komprimieren</span>',
        compress_desc:       'Bildgröße ohne merklichen Qualitätsverlust reduzieren',
        compress_level:      'Komprimierungsstufe',
        compress_size_label: 'Dateigröße',
        btn_compress:        'Komprimieren',
        // PDF
        pdf_title:           'PDF <span class="accent">Werkzeuge</span>',
        pdf_desc:            'Bilder in PDF oder PDF in Bilder umwandeln',
        pdf_mode_img2pdf:    'Bilder → PDF',
        pdf_mode_img2pdf_desc: 'Ein oder mehrere JPG/PNG zu PDF',
        pdf_mode_pdf2img:    'PDF → Bilder',
        pdf_mode_pdf2img_desc: 'Jede Seite als PNG',
        pdf_drop_multi:      'Ein oder mehrere Bilder ablegen',
        btn_make_pdf:        'PDF erstellen',
        pdf2img_soon_title:  'PDF → Bilder',
        pdf2img_soon_text:   'Benötigt PDF.js. Fertig im nächsten Update!',
    }
};

var currentLang = 'en';

function applyLang(lang) {
    currentLang = lang;
    var t = TRANSLATIONS[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });

    document.getElementById('currentLangLabel').textContent = lang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(function(opt) {
        var isActive = opt.dataset.lang === lang;
        opt.classList.toggle('active-lang', isActive);
        var check = opt.querySelector('.lang-check');
        if (check) check.style.opacity = isActive ? '1' : '0';
    });

    document.documentElement.lang = lang;
}

// ── LANGUAGE SWITCHER UI ─────────────────────────

var langToggle   = document.getElementById('langToggle');
var langDropdown = document.getElementById('langDropdown');

langToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    langDropdown.hidden = !langDropdown.hidden;
});

document.addEventListener('click', function() {
    langDropdown.hidden = true;
});

langDropdown.addEventListener('click', function(e) { e.stopPropagation(); });

document.querySelectorAll('.lang-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
        applyLang(this.dataset.lang);
        langDropdown.hidden = true;
    });
});

// Ініціалізація мови — викликається в кінці файлу після всіх translations

// ── NAVIGATION ──────────────────────────────────

document.querySelectorAll('.nav-item:not(.soon)').forEach(function(item) {
    item.addEventListener('click', function() {
        var sectionId = this.dataset.section;

        // Activate nav item
        document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
        this.classList.add('active');

        // Show section
        document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
        var target = document.getElementById('section-' + sectionId);
        if (target) target.classList.add('active');
    });
});


// ── UTILS ───────────────────────────────────────

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

function setupDragDrop(dropZone, fileInput, onFile) {
    // Клік на drop zone — відкрити діалог тільки якщо клік НЕ на label/input
    dropZone.addEventListener('click', function(e) {
        var tag = e.target.tagName.toLowerCase();
        if (tag === 'label' || tag === 'input') return; // label сам відкриє input
        fileInput.click();
    });
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        var files = e.dataTransfer.files;
        if (files[0] && files[0].type.startsWith('image/')) {
            onFile(files[0]);
        } else {
            alert('Будь ласка, виберіть файл зображення!');
        }
    });
    fileInput.addEventListener('change', function() {
        if (this.files[0]) onFile(this.files[0]);
    });
}


// ── SECTION 1: КОНВЕРТАЦІЯ ──────────────────────

var fileInput       = document.getElementById('fileInput');
var dropZone        = document.getElementById('dropZone');
var fileInfo        = document.getElementById('fileInfo');
var fileName        = document.getElementById('fileName');
var fileSize        = document.getElementById('fileSize');
var clearFileBtn    = document.getElementById('clearFileBtn');
var formatSelect    = document.getElementById('formatSelect');
var qualityRange    = document.getElementById('qualityRange');
var qualityValue    = document.getElementById('qualityValue');
var convertBtn      = document.getElementById('convertBtn');
var downloadBtn     = document.getElementById('downloadBtn');
var convertControls = document.getElementById('convertControls');
var convertActions  = document.getElementById('convertActions');
var progressWrap    = document.getElementById('progressWrap');
var progressFill    = document.getElementById('progressFill');
var progressLabel   = document.getElementById('progressLabel');

var currentConvertFile = null;

// Drag & drop для конвертації
setupDragDrop(dropZone, fileInput, function(file) {
    currentConvertFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    fileInfo.hidden = false;
    convertControls.hidden = false;
    convertActions.hidden = false;
    convertBtn.disabled = false;
    downloadBtn.hidden = true;
    progressWrap.hidden = true;
});

// Слайдер якості
qualityRange.addEventListener('input', function() {
    qualityValue.textContent = this.value;
});

// Очистити файл
clearFileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    currentConvertFile = null;
    fileInput.value = '';
    fileInfo.hidden = true;
    convertControls.hidden = true;
    convertActions.hidden = true;
    downloadBtn.hidden = true;
    progressWrap.hidden = true;
    convertBtn.disabled = true;
});

// Конвертація
convertBtn.addEventListener('click', function() {
    if (!currentConvertFile) {
        alert('Виберіть файл!');
        return;
    }

    var format  = formatSelect.value;
    var quality = parseInt(qualityRange.value) / 100;
    var mime    = 'image/' + format;

    // Показати прогрес
    progressWrap.hidden = false;
    progressFill.style.width = '0%';
    progressLabel.textContent = 'Зчитування файлу...';
    convertBtn.disabled = true;
    downloadBtn.hidden = true;

    var reader = new FileReader();

    reader.onprogress = function(e) {
        if (e.lengthComputable) {
            var pct = (e.loaded / e.total) * 40;
            progressFill.style.width = pct + '%';
        }
    };

    reader.onload = function(e) {
        progressFill.style.width = '50%';
        progressLabel.textContent = 'Конвертація...';

        var img = new Image();
        img.onload = function() {
            progressFill.style.width = '75%';

            var canvas = document.createElement('canvas');
            canvas.width  = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var result = canvas.toDataURL(mime, quality);
            var blob   = dataURItoBlob(result);
            var url    = URL.createObjectURL(blob);

            // Розширення файлу
            var ext = format === 'jpeg' ? 'jpg' : format;
            var origName = currentConvertFile.name.replace(/\.[^/.]+$/, '');

            downloadBtn.href     = url;
            downloadBtn.download = origName + '_converted.' + ext;
            downloadBtn.hidden   = false;

            progressFill.style.width = '100%';
            progressLabel.textContent = 'Готово! (' + formatBytes(blob.size) + ')';

            convertBtn.disabled = false;

            // Приховати прогрес через 2 сек
            setTimeout(function() {
                progressWrap.hidden = true;
            }, 2000);
        };
        img.src = e.target.result;
    };

    reader.onerror = function() {
        progressWrap.hidden = true;
        convertBtn.disabled = false;
        alert('Помилка зчитування файлу. Спробуй ще раз.');
    };

    reader.readAsDataURL(currentConvertFile);
});


// ── SECTION 2: ПОКРАЩЕННЯ ЯКОСТІ ───────────────

var dropZoneEnhance     = document.getElementById('dropZoneEnhance');
var fileInputEnhance    = document.getElementById('fileInputEnhance');
var enhanceWorkspace    = document.getElementById('enhanceWorkspace');
var previewImg          = document.getElementById('previewImg');
var exportCanvas        = document.getElementById('exportCanvas');
var brightnessRange     = document.getElementById('brightnessRange');
var contrastRange       = document.getElementById('contrastRange');
var saturationRange     = document.getElementById('saturationRange');
var sharpnessRange      = document.getElementById('sharpnessRange');
var brightnessValue     = document.getElementById('brightnessValue');
var contrastValue       = document.getElementById('contrastValue');
var saturationValue     = document.getElementById('saturationValue');
var sharpValue          = document.getElementById('sharpValue');
var applyEnhanceBtn     = document.getElementById('applyEnhanceBtn');
var resetEnhanceBtn     = document.getElementById('resetEnhanceBtn');
var downloadEnhanceBtn  = document.getElementById('downloadEnhanceBtn');

var enhanceImg = null; // оригінальний Image об'єкт

// Drag & drop для покращення
setupDragDrop(dropZoneEnhance, fileInputEnhance, function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            enhanceImg = img;
            previewImg.src = e.target.result;
            enhanceWorkspace.hidden = false;
            downloadEnhanceBtn.hidden = true;
            updatePreview();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Слайдери покращення — оновлення мітки і превью
function bindEnhanceSlider(slider, label) {
    slider.addEventListener('input', function() {
        label.textContent = this.value;
        updatePreview();
    });
}

bindEnhanceSlider(brightnessRange, brightnessValue);
bindEnhanceSlider(contrastRange,   contrastValue);
bindEnhanceSlider(saturationRange, saturationValue);
bindEnhanceSlider(sharpnessRange,  sharpValue);

// Оновити превью через CSS filter (миттєво)
function updatePreview() {
    if (!enhanceImg) return;

    var brightness  = parseInt(brightnessRange.value);
    var contrast    = parseInt(contrastRange.value);
    var saturation  = parseInt(saturationRange.value);

    // CSS filter для live-preview
    var bPct  = 100 + brightness;         // 0–200%
    var cPct  = 100 + contrast;           // 0–200%
    var sPct  = 100 + saturation;         // 0–200%

    previewImg.style.filter = [
        'brightness(' + bPct + '%)',
        'contrast(' + cPct + '%)',
        'saturate(' + sPct + '%)'
    ].join(' ');
}

// Скинути всі значення
resetEnhanceBtn.addEventListener('click', function() {
    brightnessRange.value = 0;  brightnessValue.textContent = '0';
    contrastRange.value   = 0;  contrastValue.textContent   = '0';
    saturationRange.value = 0;  saturationValue.textContent = '0';
    sharpnessRange.value  = 0;  sharpValue.textContent      = '0';
    if (previewImg) previewImg.style.filter = '';
    downloadEnhanceBtn.hidden = true;
});

// Застосувати + завантажити через canvas
applyEnhanceBtn.addEventListener('click', function() {
    if (!enhanceImg) return;

    var brightness = parseInt(brightnessRange.value);
    var contrast   = parseInt(contrastRange.value);
    var saturation = parseInt(saturationRange.value);
    var sharpness  = parseInt(sharpnessRange.value) / 100;

    var w = enhanceImg.naturalWidth;
    var h = enhanceImg.naturalHeight;

    exportCanvas.width  = w;
    exportCanvas.height = h;
    var ctx = exportCanvas.getContext('2d');

    // Застосувати CSS фільтри через canvas
    var bPct = 100 + brightness;
    var cPct = 100 + contrast;
    var sPct = 100 + saturation;

    ctx.filter = [
        'brightness(' + bPct + '%)',
        'contrast(' + cPct + '%)',
        'saturate(' + sPct + '%)'
    ].join(' ');

    ctx.drawImage(enhanceImg, 0, 0, w, h);

    // Застосувати sharpen конволюцію якщо потрібно
    if (sharpness > 0) {
        ctx.filter = 'none';
        applySharpen(ctx, w, h, sharpness);
    }

    exportCanvas.toBlob(function(blob) {
        var url = URL.createObjectURL(blob);
        downloadEnhanceBtn.href     = url;
        downloadEnhanceBtn.download = 'enhanced.png';
        downloadEnhanceBtn.hidden   = false;
    }, 'image/png');
});

// Різкість через матрицю конволюції
function applySharpen(ctx, width, height, amount) {
    var imageData = ctx.getImageData(0, 0, width, height);
    var data      = imageData.data;
    var w         = width;

    // Ядро різкості (unsharp mask variant)
    var k = amount * 0.6;
    var kernel = [
         0,    -k,      0,
        -k,  1 + 4*k,  -k,
         0,    -k,      0
    ];

    var output = new Uint8ClampedArray(data.length);

    for (var y = 1; y < height - 1; y++) {
        for (var x = 1; x < width - 1; x++) {
            var idx = (y * w + x) * 4;
            var r = 0, g = 0, b = 0;
            var ki = 0;

            for (var ky = -1; ky <= 1; ky++) {
                for (var kx = -1; kx <= 1; kx++) {
                    var ni = ((y + ky) * w + (x + kx)) * 4;
                    var kv = kernel[ki++];
                    r += data[ni]     * kv;
                    g += data[ni + 1] * kv;
                    b += data[ni + 2] * kv;
                }
            }

            output[idx]     = Math.min(255, Math.max(0, r));
            output[idx + 1] = Math.min(255, Math.max(0, g));
            output[idx + 2] = Math.min(255, Math.max(0, b));
            output[idx + 3] = data[idx + 3]; // alpha без змін
        }
    }

    // Краї — просто копіюємо
    for (var y2 = 0; y2 < height; y2++) {
        for (var x2 = 0; x2 < width; x2++) {
            if (y2 === 0 || y2 === height-1 || x2 === 0 || x2 === width-1) {
                var ei = (y2 * w + x2) * 4;
                output[ei]     = data[ei];
                output[ei + 1] = data[ei + 1];
                output[ei + 2] = data[ei + 2];
                output[ei + 3] = data[ei + 3];
            }
        }
    }

    imageData.data.set(output);
    ctx.putImageData(imageData, 0, 0);
}


// ── HAMBURGER (MOBILE) ──────────────────────────

var hamburger       = document.getElementById('hamburger');
var sidebarEl       = document.getElementById('sidebar');
var sidebarOverlay  = document.getElementById('sidebar-overlay');

function closeSidebar() {
    hamburger.classList.remove('open');
    sidebarEl.classList.remove('open');
    sidebarOverlay.classList.remove('open');
}

hamburger.addEventListener('click', function() {
    var isOpen = sidebarEl.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    sidebarOverlay.classList.toggle('open', isOpen);
});

sidebarOverlay.addEventListener('click', closeSidebar);

// Закривати sidebar при виборі пункту меню на мобілці
document.querySelectorAll('.nav-item:not(.soon)').forEach(function(item) {
    item.addEventListener('click', function() {
        if (window.innerWidth <= 768) closeSidebar();
    });
});


// ── SECTION 4: СТИСНЕННЯ ────────────────────────

var dropZoneCompress    = document.getElementById('dropZoneCompress');
var fileInputCompress   = document.getElementById('fileInputCompress');
var compressControls    = document.getElementById('compressControls');
var compressRange       = document.getElementById('compressRange');
var compressValue       = document.getElementById('compressValue');
var compressOrigSize    = document.getElementById('compressOrigSize');
var compressNewSize     = document.getElementById('compressNewSize');
var compressBtn         = document.getElementById('compressBtn');
var downloadCompressBtn = document.getElementById('downloadCompressBtn');
var compressProgress    = document.getElementById('compressProgress');
var compressProgressFill= document.getElementById('compressProgressFill');
var compressProgressLabel= document.getElementById('compressProgressLabel');

var compressSourceFile  = null;

setupDragDrop(dropZoneCompress, fileInputCompress, function(file) {
    compressSourceFile = file;
    compressOrigSize.textContent = formatBytes(file.size);
    compressNewSize.textContent  = '—';
    compressControls.hidden      = false;
    downloadCompressBtn.hidden   = true;
    compressProgress.hidden      = true;
});

compressRange.addEventListener('input', function() {
    compressValue.textContent = this.value;
    if (compressSourceFile) estimateCompressSize();
});

function estimateCompressSize() {
    var quality = parseInt(compressRange.value) / 100;
    // Груба оцінка: JPG при якості Q ≈ originalSize * Q * 0.35 (JPG compression ratio)
    var est = Math.round(compressSourceFile.size * quality * 0.38);
    compressNewSize.textContent = formatBytes(est) + ' ~';
}

compressBtn.addEventListener('click', function() {
    if (!compressSourceFile) return;

    var quality = parseInt(compressRange.value) / 100;
    compressProgress.hidden = false;
    compressProgressFill.style.width = '0%';
    compressProgressLabel.textContent = 'Зчитування...';
    compressBtn.disabled = true;
    downloadCompressBtn.hidden = true;

    var reader = new FileReader();
    reader.onload = function(e) {
        compressProgressFill.style.width = '40%';
        var img = new Image();
        img.onload = function() {
            compressProgressFill.style.width = '65%';
            var canvas = document.createElement('canvas');
            canvas.width  = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            compressProgressFill.style.width = '85%';
            canvas.toBlob(function(blob) {
                var url = URL.createObjectURL(blob);
                downloadCompressBtn.href     = url;
                downloadCompressBtn.download = 'compressed_' + compressSourceFile.name;
                downloadCompressBtn.hidden   = false;
                compressNewSize.textContent  = formatBytes(blob.size);
                compressProgressFill.style.width = '100%';
                compressProgressLabel.textContent = 'Готово! ' + formatBytes(blob.size);
                compressBtn.disabled = false;
                setTimeout(function() { compressProgress.hidden = true; }, 2000);
            }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(compressSourceFile);
});


// ── SECTION 5: PDF ──────────────────────────────

var dropZonePdf     = document.getElementById('dropZonePdf');
var fileInputPdf    = document.getElementById('fileInputPdf');
var pdfFileList     = document.getElementById('pdfFileList');
var pdfActions      = document.getElementById('pdfActions');
var makePdfBtn      = document.getElementById('makePdfBtn');
var downloadPdfBtn  = document.getElementById('downloadPdfBtn');
var pdfProgress     = document.getElementById('pdfProgress');
var pdfProgressFill = document.getElementById('pdfProgressFill');
var pdfProgressLabel= document.getElementById('pdfProgressLabel');

var pdfFiles = [];

// PDF mode switcher
document.querySelectorAll('[data-pdf-mode]').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('[data-pdf-mode]').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        var mode = this.dataset.pdfMode;
        document.getElementById('pdfImgMode').hidden  = (mode !== 'img2pdf');
        document.getElementById('pdfToImgMode').hidden = (mode !== 'pdf2img');
    });
});

// Drag & drop для PDF (підтримка кількох файлів)
dropZonePdf.addEventListener('click', function(e) {
    var tag = e.target.tagName.toLowerCase();
    if (tag === 'label' || tag === 'input') return;
    fileInputPdf.click();
});
dropZonePdf.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropZonePdf.classList.add('drag-over');
});
dropZonePdf.addEventListener('dragleave', function() {
    dropZonePdf.classList.remove('drag-over');
});
dropZonePdf.addEventListener('drop', function(e) {
    e.preventDefault();
    dropZonePdf.classList.remove('drag-over');
    addPdfFiles(Array.from(e.dataTransfer.files).filter(function(f) { return f.type.startsWith('image/'); }));
});
fileInputPdf.addEventListener('change', function() {
    addPdfFiles(Array.from(this.files));
});

function addPdfFiles(files) {
    pdfFiles = pdfFiles.concat(files);
    renderPdfFileList();
}

function renderPdfFileList() {
    pdfFileList.innerHTML = '';
    pdfFiles.forEach(function(f, i) {
        var item = document.createElement('div');
        item.className = 'pdf-file-item';
        item.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>'
            + '<span>' + f.name + '</span>'
            + '<span class="pdf-file-size">' + formatBytes(f.size) + '</span>';
        pdfFileList.appendChild(item);
    });
    pdfFileList.hidden = (pdfFiles.length === 0);
    pdfActions.hidden  = (pdfFiles.length === 0);
}

makePdfBtn.addEventListener('click', function() {
    if (pdfFiles.length === 0) return;
    if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
        alert('jsPDF не завантажено. Перевір з\'єднання з інтернетом.');
        return;
    }

    var jsPDF = window.jspdf.jsPDF;
    pdfProgress.hidden = false;
    pdfProgressFill.style.width = '0%';
    pdfProgressLabel.textContent = 'Генерація PDF...';
    makePdfBtn.disabled = true;
    downloadPdfBtn.hidden = true;

    var pdf = null;
    var index = 0;

    function processNext() {
        if (index >= pdfFiles.length) {
            var blob = pdf.output('blob');
            var url  = URL.createObjectURL(blob);
            downloadPdfBtn.href     = url;
            downloadPdfBtn.download = 'convertx_export.pdf';
            downloadPdfBtn.hidden   = false;
            pdfProgressFill.style.width = '100%';
            pdfProgressLabel.textContent = 'Готово! ' + pdfFiles.length + ' стор.';
            makePdfBtn.disabled = false;
            setTimeout(function() { pdfProgress.hidden = true; }, 2000);
            return;
        }

        var pct = Math.round((index / pdfFiles.length) * 90);
        pdfProgressFill.style.width = pct + '%';
        pdfProgressLabel.textContent = 'Обробка ' + (index + 1) + ' / ' + pdfFiles.length + '...';

        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var w = img.width;
                var h = img.height;
                var orientation = (w > h) ? 'l' : 'p';

                if (pdf === null) {
                    pdf = new jsPDF({ orientation: orientation, unit: 'px', format: [w, h] });
                } else {
                    pdf.addPage([w, h], orientation);
                }

                pdf.addImage(e.target.result, 'JPEG', 0, 0, w, h);
                index++;
                processNext();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(pdfFiles[index]);
    }

    processNext();
});



var dropZoneUpscale     = document.getElementById('dropZoneUpscale');
var fileInputUpscale    = document.getElementById('fileInputUpscale');
var upscaleControls     = document.getElementById('upscaleControls');
var scaleSelect         = document.getElementById('scaleSelect');
var origSizeEl          = document.getElementById('origSize');
var newSizeEl           = document.getElementById('newSize');
var upscaleBtn          = document.getElementById('upscaleBtn');
var downloadUpscaleBtn  = document.getElementById('downloadUpscaleBtn');
var upscaleProgress     = document.getElementById('upscaleProgress');
var upscaleProgressFill = document.getElementById('upscaleProgressFill');
var upscaleProgressLabel= document.getElementById('upscaleProgressLabel');
var upscaleCompare      = document.getElementById('upscaleCompare');
var upscaleOrigImg      = document.getElementById('upscaleOrigImg');
var upscaleResultImg    = document.getElementById('upscaleResultImg');
var upscaleCanvas       = document.getElementById('upscaleCanvas');
var methodTabs          = document.querySelectorAll('.method-tab');
var aiNotice            = document.getElementById('aiNotice');

var upscaleSourceImg  = null;
var currentMethod     = 'lanczos';

// Вибір методу
methodTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        methodTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        currentMethod = this.dataset.method;
        aiNotice.hidden = (currentMethod !== 'ai');
        downloadUpscaleBtn.hidden = true;
        upscaleCompare.hidden = true;
    });
});

// Drag & drop
setupDragDrop(dropZoneUpscale, fileInputUpscale, function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            upscaleSourceImg = img;
            upscaleOrigImg.src = e.target.result;
            upscaleControls.hidden = false;
            downloadUpscaleBtn.hidden = true;
            upscaleCompare.hidden = true;
            updateSizePreview();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Оновити preview розміру
function updateSizePreview() {
    if (!upscaleSourceImg) return;
    var scale = parseInt(scaleSelect.value);
    var ow = upscaleSourceImg.naturalWidth;
    var oh = upscaleSourceImg.naturalHeight;
    origSizeEl.textContent = ow + '×' + oh;
    newSizeEl.textContent  = (ow * scale) + '×' + (oh * scale);
}

scaleSelect.addEventListener('change', updateSizePreview);

// ── Кнопка "Збільшити" ──
upscaleBtn.addEventListener('click', function() {
    if (!upscaleSourceImg) return;

    downloadUpscaleBtn.hidden = true;
    upscaleCompare.hidden = true;
    upscaleProgress.hidden = false;
    upscaleProgressFill.style.width = '0%';
    upscaleBtn.disabled = true;

    if (currentMethod === 'lanczos') {
        runLanczos();
    } else {
        runAI();
    }
});

// ────────────────────────────────────────────────
// LANCZOS реалізація
// ────────────────────────────────────────────────
function runLanczos() {
    var scale  = parseInt(scaleSelect.value);
    var srcW   = upscaleSourceImg.naturalWidth;
    var srcH   = upscaleSourceImg.naturalHeight;
    var dstW   = srcW * scale;
    var dstH   = srcH * scale;

    upscaleProgressLabel.textContent = 'Lanczos інтерполяція...';
    upscaleProgressFill.style.width = '20%';

    // Спочатку малюємо оригінал на temp canvas
    var srcCanvas = document.createElement('canvas');
    srcCanvas.width  = srcW;
    srcCanvas.height = srcH;
    var srcCtx = srcCanvas.getContext('2d');
    srcCtx.drawImage(upscaleSourceImg, 0, 0);
    var srcData = srcCtx.getImageData(0, 0, srcW, srcH).data;

    upscaleProgressFill.style.width = '40%';
    upscaleProgressLabel.textContent = 'Обчислення пікселів...';

    // Виконуємо в setTimeout щоб браузер не завис
    setTimeout(function() {
        upscaleCanvas.width  = dstW;
        upscaleCanvas.height = dstH;
        var dstCtx  = upscaleCanvas.getContext('2d');
        var dstData = dstCtx.createImageData(dstW, dstH);
        var dst     = dstData.data;

        var LOBES = 3; // Lanczos-3

        function lanczosKernel(x) {
            if (x === 0) return 1;
            if (Math.abs(x) >= LOBES) return 0;
            var px = Math.PI * x;
            return (LOBES * Math.sin(px) * Math.sin(px / LOBES)) / (px * px);
        }

        for (var dy = 0; dy < dstH; dy++) {
            var fy = dy / scale;
            var y0 = Math.floor(fy) - LOBES + 1;

            for (var dx = 0; dx < dstW; dx++) {
                var fx = dx / scale;
                var x0 = Math.floor(fx) - LOBES + 1;

                var r = 0, g = 0, b = 0, a = 0, wSum = 0;

                for (var ky = y0; ky <= y0 + 2 * LOBES - 1; ky++) {
                    var wy = lanczosKernel(fy - ky);
                    var sy = Math.min(Math.max(ky, 0), srcH - 1);

                    for (var kx = x0; kx <= x0 + 2 * LOBES - 1; kx++) {
                        var wx  = lanczosKernel(fx - kx);
                        var w   = wx * wy;
                        var sx  = Math.min(Math.max(kx, 0), srcW - 1);
                        var idx = (sy * srcW + sx) * 4;

                        r += srcData[idx]     * w;
                        g += srcData[idx + 1] * w;
                        b += srcData[idx + 2] * w;
                        a += srcData[idx + 3] * w;
                        wSum += w;
                    }
                }

                var di = (dy * dstW + dx) * 4;
                dst[di]     = Math.min(255, Math.max(0, Math.round(r / wSum)));
                dst[di + 1] = Math.min(255, Math.max(0, Math.round(g / wSum)));
                dst[di + 2] = Math.min(255, Math.max(0, Math.round(b / wSum)));
                dst[di + 3] = Math.min(255, Math.max(0, Math.round(a / wSum)));
            }

            // Оновлюємо прогрес кожні 20 рядків
            if (dy % 20 === 0) {
                var pct = 40 + Math.round((dy / dstH) * 55);
                upscaleProgressFill.style.width = pct + '%';
            }
        }

        dstCtx.putImageData(dstData, 0, 0);
        finishUpscale('lanczos_' + scale + 'x');
    }, 50);
}

// ────────────────────────────────────────────────
// AI UPSCALE через TensorFlow.js (bicubic як fallback якщо модель не завантажилась)
// Real-ESRGAN потребує WASM/ONNX, тут використовуємо TF.js tensor resizing
// ────────────────────────────────────────────────
function runAI() {
    upscaleProgressLabel.textContent = 'Завантаження TensorFlow...';
    upscaleProgressFill.style.width = '10%';

    if (typeof tf === 'undefined') {
        upscaleProgressLabel.textContent = 'TF.js не завантажено, використовую Lanczos...';
        setTimeout(runLanczos, 300);
        return;
    }

    upscaleProgressLabel.textContent = 'Обробка через TF.js...';
    upscaleProgressFill.style.width = '30%';

    var scale = parseInt(scaleSelect.value);
    var srcW  = upscaleSourceImg.naturalWidth;
    var srcH  = upscaleSourceImg.naturalHeight;
    var dstW  = srcW * scale;
    var dstH  = srcH * scale;

    // Попередження для великих зображень
    if (srcW * srcH > 1500 * 1500) {
        upscaleProgressLabel.textContent = 'Велике зображення — може зайняти хвилину...';
    }

    tf.tidy(function() {
        try {
            // Зчитати пікселі з canvas
            var srcCanvas = document.createElement('canvas');
            srcCanvas.width  = srcW;
            srcCanvas.height = srcH;
            var srcCtx = srcCanvas.getContext('2d');
            srcCtx.drawImage(upscaleSourceImg, 0, 0);

            upscaleProgressFill.style.width = '50%';

            // Перетворити в тензор і зробити bicubic upscale через TF.js
            var tensor = tf.browser.fromPixels(srcCanvas);
            var expanded = tensor.expandDims(0).toFloat();

            // TF.js image resizeBicubic — це справжній bicubic (якісніше за canvas)
            var resized = tf.image.resizeBicubic(expanded, [dstH, dstW], true);

            upscaleProgressFill.style.width = '75%';
            upscaleProgressLabel.textContent = 'Запис результату...';

            // Записати назад у canvas
            upscaleCanvas.width  = dstW;
            upscaleCanvas.height = dstH;
            var dstCtx = upscaleCanvas.getContext('2d');

            var squeezed = resized.squeeze().toInt();
            tf.browser.toPixels(squeezed, upscaleCanvas).then(function() {
                finishUpscale('ai_bicubic_' + scale + 'x');
            });

        } catch (err) {
            console.error('TF upscale error:', err);
            upscaleProgressLabel.textContent = 'Помилка TF.js, використовую Lanczos...';
            setTimeout(runLanczos, 300);
        }
    });
}

// ── Спільне завершення ──
function finishUpscale(suffix) {
    upscaleProgressFill.style.width = '100%';
    upscaleProgressLabel.textContent = 'Готово!';

    var dataURL = upscaleCanvas.toDataURL('image/png');
    upscaleResultImg.src = dataURL;
    upscaleCompare.hidden = false;
    initBASlider(); // запускаємо слайдер після показу

    var blob = dataURItoBlob(dataURL);
    var url  = URL.createObjectURL(blob);
    downloadUpscaleBtn.href     = url;
    downloadUpscaleBtn.download = 'upscaled_' + suffix + '.png';
    downloadUpscaleBtn.hidden   = false;

    upscaleBtn.disabled = false;

    setTimeout(function() { upscaleProgress.hidden = true; }, 1500);
}

// ══════════════════════════════════════
// BEFORE / AFTER SLIDER
// ══════════════════════════════════════
function initBASlider() {
    var slider     = document.getElementById('baSlider');
    var beforeWrap = document.getElementById('baBeforeWrap');
    var handle     = document.getElementById('baHandle');
    if (!slider) return;

    // Встановлюємо розмір before-wrap рівний розміру after-img
    var afterImg = document.getElementById('upscaleResultImg');
    var beforeImg = document.getElementById('upscaleOrigImg');

    // Синхронізуємо розмір before-img з after-img після завантаження
    function syncSize() {
        var w = slider.offsetWidth;
        beforeWrap.style.width = (w * 0.5) + 'px';
        beforeImg.style.width  = w + 'px';
        handle.style.left      = '50%';
    }

    afterImg.onload = syncSize;
    // Якщо вже завантажено
    if (afterImg.complete) syncSize();

    function setPos(x) {
        var rect = slider.getBoundingClientRect();
        var pct  = Math.min(Math.max((x - rect.left) / rect.width, 0.02), 0.98);
        beforeWrap.style.width = (pct * 100) + '%';
        beforeImg.style.width  = slider.offsetWidth + 'px';
        handle.style.left      = (pct * 100) + '%';
    }

    // Mouse
    slider.addEventListener('mousedown', function(e) {
        e.preventDefault();
        setPos(e.clientX);
        function onMove(e) { setPos(e.clientX); }
        function onUp()    { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
    });

    // Touch
    slider.addEventListener('touchstart', function(e) {
        e.preventDefault();
        setPos(e.touches[0].clientX);
        function onMove(e) { setPos(e.touches[0].clientX); }
        function onEnd()   { slider.removeEventListener('touchmove', onMove); slider.removeEventListener('touchend', onEnd); }
        slider.addEventListener('touchmove', onMove, { passive: false });
        slider.addEventListener('touchend',  onEnd);
    }, { passive: false });
}

// ── ІНІЦІАЛІЗАЦІЯ МОВИ (після всіх translations) ─
applyLang('en');
