


// ══════════════════════════════════════════════
// AUDIO CONVERTER
// ══════════════════════════════════════════════
(function() {
    var dropZone       = document.getElementById('dropZoneAudio');
    var fileInput      = document.getElementById('fileInputAudio');
    var fileInfo       = document.getElementById('audioFileInfo');
    var fileName       = document.getElementById('audioFileName');
    var fileSize       = document.getElementById('audioFileSize');
    var resetBtn       = document.getElementById('audioResetBtn');
    var controls       = document.getElementById('audioControls');
    var actions        = document.getElementById('audioActions');
    var convertBtn     = document.getElementById('audioConvertBtn');
    var downloadBtn    = document.getElementById('audioDownloadBtn');
    var progress       = document.getElementById('audioProgress');
    var progressFill   = document.getElementById('audioProgressFill');
    var progressLabel  = document.getElementById('audioProgressLabel');
    var formatSelect   = document.getElementById('audioFormat');
    var qualitySelect  = document.getElementById('audioMp3Quality');
    var qualityGroup   = document.getElementById('audioMp3QualityGroup');

    if (!dropZone) return;

    var currentFile = null;
    var currentBlob = null;

    function formatBytes(b) {
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
        return (b/1048576).toFixed(1) + ' MB';
    }

    function setFile(file) {
        if (!file || !file.type.startsWith('audio/')) {
            alert('Please select an audio file');
            return;
        }
        if (file.size > 100 * 1024 * 1024) {
            alert('File too large. Max 100 MB.');
            return;
        }
        currentFile = file;
        currentBlob = null;
        fileName.textContent = file.name;
        fileSize.textContent = formatBytes(file.size);
        fileInfo.hidden = false;
        controls.hidden = false;
        actions.hidden = false;
        downloadBtn.hidden = true;
        progress.hidden = true;
        progressFill.style.width = '0%';
    }

    function resetAudio() {
        currentFile = null; currentBlob = null;
        fileInput.value = '';
        fileInfo.hidden = true;
        controls.hidden = true;
        actions.hidden = true;
        downloadBtn.hidden = true;
        progress.hidden = true;
    }

    // Drag & drop
    dropZone.addEventListener('dragover', function(e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', function() { dropZone.classList.remove('drag-over'); });
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault(); dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', function() { if (this.files[0]) setFile(this.files[0]); });
    resetBtn.addEventListener('click', resetAudio);

    // Show/hide MP3 quality
    formatSelect.addEventListener('change', function() {
        qualityGroup.style.display = this.value === 'mp3' ? '' : 'none';
    });

    // ── CONVERT ──────────────────────────────────
    convertBtn.addEventListener('click', function() {
        if (!currentFile) return;
        var fmt = formatSelect.value;
        progress.hidden = false;
        progressFill.style.width = '10%';
        var t = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
        progressLabel.textContent = t.prog_processing || 'Processing...';
        downloadBtn.hidden = true;

        var reader = new FileReader();
        reader.onload = function(e) {
            progressFill.style.width = '30%';
            var arrayBuffer = e.target.result;
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            var ctx = new AudioCtx();
            ctx.decodeAudioData(arrayBuffer, function(audioBuffer) {
                progressFill.style.width = '60%';
                if (fmt === 'wav') {
                    var blob = audioBufferToWav(audioBuffer);
                    finishDownload(blob, 'wav', 'audio/wav');
                } else if (fmt === 'mp3') {
                    encodeMP3(audioBuffer, parseInt(qualitySelect.value), function(blob) {
                        finishDownload(blob, 'mp3', 'audio/mpeg');
                    });
                }
                ctx.close();
            }, function() {
                progress.hidden = true;
                alert('Could not decode audio. Try a different format.');
            });
        };
        reader.readAsArrayBuffer(currentFile);
    });

    function finishDownload(blob, ext, mime) {
        currentBlob = blob;
        progressFill.style.width = '100%';
        var t = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
        progressLabel.textContent = (t.prog_done || 'Done!') + ' (' + formatBytes(blob.size) + ')';
        downloadBtn.hidden = false;
        downloadBtn.onclick = function() {
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            var base = currentFile.name.replace(/\.[^/.]+$/, '');
            a.download = base + '.' + ext;
            a.click();
            setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
        };
    }

    // ── WAV ENCODER ──────────────────────────────
    function audioBufferToWav(buffer) {
        var numCh = buffer.numberOfChannels;
        var sr = buffer.sampleRate;
        var numSamples = buffer.length;
        var bytesPerSample = 2;
        var dataSize = numCh * numSamples * bytesPerSample;
        var ab = new ArrayBuffer(44 + dataSize);
        var view = new DataView(ab);
        function writeStr(off, str) { for (var i=0;i<str.length;i++) view.setUint8(off+i, str.charCodeAt(i)); }
        writeStr(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeStr(8, 'WAVE');
        writeStr(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numCh, true);
        view.setUint32(24, sr, true);
        view.setUint32(28, sr * numCh * bytesPerSample, true);
        view.setUint16(32, numCh * bytesPerSample, true);
        view.setUint16(34, 16, true);
        writeStr(36, 'data');
        view.setUint32(40, dataSize, true);
        var offset = 44;
        for (var i = 0; i < numSamples; i++) {
            for (var ch = 0; ch < numCh; ch++) {
                var s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
                view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                offset += 2;
            }
        }
        return new Blob([ab], { type: 'audio/wav' });
    }

    // ── MP3 ENCODER (lamejs via CDN) ─────────────
    function encodeMP3(buffer, quality, cb) {
        function doEncode() {
            progressFill.style.width = '65%';
            var lame = new lamejs.Mp3Encoder(buffer.numberOfChannels, buffer.sampleRate, quality === 0 ? 320 : quality === 2 ? 192 : quality === 4 ? 128 : 96);
            var left = buffer.getChannelData(0);
            var right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left;
            var blockSize = 1152;
            var mp3Data = [];
            function toInt16(ch) {
                var a = new Int16Array(ch.length);
                for (var i=0; i<ch.length; i++) a[i] = ch[i] < 0 ? ch[i] * 0x8000 : ch[i] * 0x7FFF;
                return a;
            }
            var l16 = toInt16(left), r16 = toInt16(right);
            progressFill.style.width = '75%';
            for (var i = 0; i < l16.length; i += blockSize) {
                var lc = l16.subarray(i, i+blockSize);
                var rc = r16.subarray(i, i+blockSize);
                var d = lame.encodeBuffer(lc, rc);
                if (d.length > 0) mp3Data.push(new Int8Array(d));
            }
            var flush = lame.flush();
            if (flush.length > 0) mp3Data.push(new Int8Array(flush));
            progressFill.style.width = '95%';
            cb(new Blob(mp3Data, { type: 'audio/mpeg' }));
        }
        // Завантажити lamejs якщо ще не завантажено
        if (window.lamejs) { doEncode(); return; }
        progressLabel.textContent = 'Loading MP3 encoder...';
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js';
        s.onload = doEncode;
        s.onerror = function() { alert('Could not load MP3 encoder. Try WAV format.'); progress.hidden = true; };
        document.head.appendChild(s);
    }
})();



// ══════════════════════════════════════════════
// CLOCK EASTER EGG
// ══════════════════════════════════════════════
(function() {
    // Пасхалка тільки на десктопі (не на тачскріні)
    if (window.matchMedia('(pointer: coarse)').matches) return;
    var clockImg = document.getElementById('clockImg');
    var clockScene = document.getElementById('clockScene');
    if (!clockScene) return;
    // Pointer events fix
    clockScene.style.pointerEvents = 'auto';
    if (clockImg) clockImg.style.pointerEvents = 'auto';

    var snd1 = new Audio('AnyNotification.ogg'); snd1.volume = 0.35;
    var snd2 = new Audio('Shoot2_Zap.ogg'); snd2.volume = 0.3;

    var clickCount = 0;
    var clickTimer = null;

    // Popup helper
    function showClockMsg(msg) {
        var existing = document.getElementById('clockPopup');
        if (existing) existing.remove();
        var pop = document.createElement('div');
        pop.id = 'clockPopup';
        pop.textContent = msg;
        pop.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:#1e1208;border:1px solid rgba(232,160,48,.4);border-radius:12px;padding:14px 28px;color:#e8a030;font-family:inherit;font-size:.95rem;z-index:9998;box-shadow:0 4px 30px rgba(0,0,0,.5);pointer-events:none;animation:clockPop .3s ease;white-space:nowrap;';
        document.body.appendChild(pop);
        setTimeout(function() {
            pop.style.transition = 'opacity .4s';
            pop.style.opacity = '0';
            setTimeout(function() { pop.remove(); }, 400);
        }, 2200);
    }

    // Додати анімацію
    var st = document.createElement('style');
    st.textContent = '@keyframes clockPop{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(st);

    // Клік на саму картинку або SVG
    var clickTarget = clockImg || clockScene;
    clickTarget.style.cursor = 'pointer';
    function handleClockClick() {
        clickCount++;
        if (clickCount === 1) {
            snd1.currentTime = 0; snd1.play().catch(function(){});
            showClockMsg('Clock: what?');
        } else if (clickCount === 2) {
            snd2.currentTime = 0; snd2.play().catch(function(){});
            showClockMsg('Clock: Are you lost?');
        } else {
            snd2.currentTime = 0; snd2.play().catch(function(){});
            var target = clockScene.querySelector('.clock-img') || clockScene;
            target.style.transition = 'transform .05s';
            var shakes = 0;
            var dirs = [-8,8,-6,6,-4,4,-2,2,0];
            var shakeInterval = setInterval(function() {
                target.style.transform = 'translateX(' + (dirs[shakes]||0) + 'px)';
                shakes++;
                if (shakes >= dirs.length) {
                    clearInterval(shakeInterval);
                    target.style.transform = '';
                }
            }, 40);
            showClockMsg('Clock: STOP IT!');
            clickCount = 0;
        }
    }

    // Desktop
    clockScene.addEventListener('click', handleClockClick);

    // Mobile easter egg removed
})();


// ── SIDEBAR REALTIME CLOCK ────────────────────────
(function() {
    var el = document.getElementById('sidebarClock');
    if (!el) return;
    function tick() {
        var now = new Date();
        var h = now.getHours().toString().padStart(2,'0');
        var m = now.getMinutes().toString().padStart(2,'0');
        var s = now.getSeconds().toString().padStart(2,'0');
        var op = now.getSeconds() % 2 === 0 ? '1' : '0.25';
        el.innerHTML = h
            + '<span style="opacity:' + op + ';display:inline-block;width:.5em;text-align:center">:</span>'
            + m
            + '<span style="font-size:.72em;opacity:.55"> '
            + '<span style="opacity:' + op + ';display:inline-block;width:.5em;text-align:center">:</span>'
            + s + '</span>';
    }
    tick();
    setInterval(tick, 500);
})();


// ── RANGE SLIDER FILL ─────────────────────────────
(function() {
    function updateRangeFill(input) {
        var min = parseFloat(input.min) || 0;
        var max = parseFloat(input.max) || 100;
        var val = parseFloat(input.value) || 0;
        var pct = ((val - min) / (max - min) * 100).toFixed(1) + '%';
        input.style.background = 'linear-gradient(to right, var(--accent) ' + pct + ', rgba(232,160,48,.15) ' + pct + ')';
    }
    function initRanges() {
        document.querySelectorAll('input[type=range]').forEach(function(r) {
            updateRangeFill(r);
            r.addEventListener('input', function() { updateRangeFill(this); });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRanges);
    } else {
        initRanges();
    }
    // Також через MutationObserver на випадок динамічних елементів
    var obs = new MutationObserver(function(muts) {
        muts.forEach(function(m) {
            m.addedNodes.forEach(function(n) {
                if (n.nodeType === 1) {
                    n.querySelectorAll && n.querySelectorAll('input[type=range]').forEach(function(r) {
                        updateRangeFill(r);
                        r.addEventListener('input', function() { updateRangeFill(this); });
                    });
                }
            });
        });
    });
    obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();

// ── THEME SYSTEM ─────────────────────────────────
(function() {
    var saved = localStorage.getItem('cx-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved ? saved === 'dark' : prefersDark;
    if (!isDark) document.documentElement.classList.add('light');
})();

function toggleTheme() {
    var isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('cx-theme', isLight ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);

    // Слухати системну тему
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('cx-theme')) {
            document.documentElement.classList.toggle('light', !e.matches);
        }
    });
});

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
        prog_reading:'Reading file...',
        prog_converting:'Converting...',
        prog_pdf:'Generating PDF...',
        prog_compressing:'Compressing...',
        prog_done:'Done!',
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
        btn_compare:    'Compare Before / After',
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
        // BG Remove
        nav_bgremove:        'Remove BG',
        bgremove_title:      'Background <span class="accent">Removal</span>',
        bgremove_desc:       'AI removes the background directly in your browser — 100% private',
        bgremove_notice:     'First run downloads the model (~40 MB). Then cached in the browser. Processing may take 5–30s.',
        // Audio + fixes
        nav_audio:          'Audio',
        audio_title:        'Audio <span class=\"accent\">Convert</span>',
        audio_desc:         'Convert MP3, OGG, WAV, FLAC without server upload',
        audio_hint:         'MP3 · WAV · OGG · FLAC · M4A · up to 100MB',
        audio_format:       'Output format',
        audio_quality:      'MP3 Quality',
        kbps_320:           '320 kbps (best)',
        support_btn:        'Support ☕',
        pdf_hint_multi:     'JPG · PNG · WEBP — multiple files at once',
        drop_hint_compress: 'JPG · PNG · WEBP · up to 50MB',
        drop_hint_bgremove: 'JPG · PNG · WEBP · up to 50MB',
        bgremove_download:  'Download PNG',
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
        prog_reading:'Зчитування файлу...',
        prog_converting:'Конвертація...',
        prog_pdf:'Генерація PDF...',
        prog_compressing:'Стиснення...',
        prog_done:'Готово!',
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
        btn_compare:    'Порівняти До / Після',
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
        // BG Remove
        nav_bgremove:        'Видал. фон',
        bgremove_title:      'Видалення <span class="accent">фону</span>',
        bgremove_desc:       'AI прибирає фон прямо в браузері — жоден байт не покидає пристрій',
        bgremove_notice:     'Перший запуск завантажує модель (~40 МБ). Далі кешується у браузері. Обробка може зайняти 5–30 сек.',
        // Audio + fixes
        nav_audio:          'Аудіо',
        audio_title:        'Аудіо <span class=\"accent\">Конвертер</span>',
        audio_desc:         'Конвертуй MP3, OGG, WAV, FLAC без завантаження на сервер',
        audio_hint:         'MP3 · WAV · OGG · FLAC · M4A · до 100MB',
        audio_format:       'Формат виводу',
        audio_quality:      'Якість MP3',
        kbps_320:           '320 kbps (найкраща)',
        support_btn:        'Підтримати ☕',
        pdf_hint_multi:     'JPG · PNG · WEBP — кілька файлів одночасно',
        drop_hint_compress: 'JPG · PNG · WEBP · до 50MB',
        drop_hint_bgremove: 'JPG · PNG · WEBP · до 50MB',
        bgremove_download:  'Завантажити PNG',
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
        prog_reading:'Datei lesen...',
        prog_converting:'Konvertieren...',
        prog_pdf:'PDF erstellen...',
        prog_compressing:'Komprimieren...',
        prog_done:'Fertig!',
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
        btn_compare:    'Vorher / Nachher vergleichen',
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
        // BG Remove
        nav_bgremove:        'Hintergrund',
        bgremove_title:      'Hintergrund <span class="accent">entfernen</span>',
        bgremove_desc:       'KI entfernt den Hintergrund direkt im Browser — 100% privat',
        bgremove_notice:     'Erster Start lädt das Modell (~40 MB). Danach im Browser gespeichert. Verarbeitung kann 5–30s dauern.',
        // Audio + fixes
        nav_audio:          'Audio',
        audio_title:        'Audio <span class=\"accent\">Konverter</span>',
        audio_desc:         'Konvertiere MP3, OGG, WAV, FLAC ohne Server-Upload',
        audio_hint:         'MP3 · WAV · OGG · FLAC · M4A · bis 100MB',
        audio_format:       'Ausgabeformat',
        audio_quality:      'MP3-Qualität',
        kbps_320:           '320 kbps (beste)',
        support_btn:        'Unterstützen ☕',
        pdf_hint_multi:     'JPG · PNG · WEBP — mehrere Dateien gleichzeitig',
        drop_hint_compress: 'JPG · PNG · WEBP · bis 50MB',
        drop_hint_bgremove: 'JPG · PNG · WEBP · bis 50MB',
        bgremove_download:  'PNG herunterladen',
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
        localStorage.setItem('cx-lang', this.dataset.lang);
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
        if (tag === 'label' || tag === 'input' || e.target.closest('label')) return;
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
var batchList       = document.getElementById('batchList');

var currentFiles = []; // масив файлів (batch)
var isBatch = false;

// ── HEIC → Blob через heic2any (lazy load) ──
function loadHeic2any(cb) {
    if (window.heic2any) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js';
    s.onload = cb;
    s.onerror = function() { alert('Could not load HEIC converter.'); };
    document.head.appendChild(s);
}

// ── SVG → PNG через canvas ──
function svgToPng(svgBlob, w, h, cb) {
    var url = URL.createObjectURL(svgBlob);
    var img = new Image();
    img.onload = function() {
        var cw = w || img.width || 1024;
        var ch = h || img.height || 1024;
        var c = document.createElement('canvas');
        c.width = cw; c.height = ch;
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, cw, ch);
        URL.revokeObjectURL(url);
        cb(c.toDataURL('image/png', 1));
    };
    img.onerror = function() { URL.revokeObjectURL(url); cb(null); };
    img.src = url;
}

// ── Растр → SVG (трасування через Path2D — базова обводка) ──
function rasterToSvg(canvas) {
    // Простий SVG з embedded PNG — сумісний і корисний для веб
    var png = canvas.toDataURL('image/png');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.width + '" height="' + canvas.height + '">'
            + '<image href="' + png + '" width="' + canvas.width + '" height="' + canvas.height + '"/></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ── Конвертувати один файл → Promise<{url, ext, size}> ──
function convertFile(file, format, quality) {
    return new Promise(function(resolve, reject) {
        var mime = 'image/' + format;
        var ext  = format === 'jpeg' ? 'jpg' : format === 'svg-export' ? 'svg' : format;

        // HEIC / HEIF
        if (/\.(heic|heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif') {
            loadHeic2any(function() {
                heic2any({ blob: file, toType: 'image/jpeg', quality: quality })
                    .then(function(blob) {
                        resolve({ url: URL.createObjectURL(blob), ext: 'jpg', size: blob.size });
                    })
                    .catch(reject);
            });
            return;
        }

        // DNG (ProRAW) — рендер через Image + canvas
        if (/\.dng$/i.test(file.name)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    var c = document.createElement('canvas');
                    c.width = img.width; c.height = img.height;
                    c.getContext('2d').drawImage(img, 0, 0);
                    var result = c.toDataURL('image/jpeg', quality);
                    var blob = dataURItoBlob(result);
                    resolve({ url: URL.createObjectURL(blob), ext: 'jpg', size: blob.size });
                };
                img.onerror = function() { reject(new Error('Cannot decode DNG')); };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            return;
        }

        // SVG input → PNG output
        if (file.type === 'image/svg+xml' || /\.svg$/i.test(file.name)) {
            svgToPng(file, 0, 0, function(dataUrl) {
                if (!dataUrl) { reject(new Error('SVG decode failed')); return; }
                var blob = dataURItoBlob(dataUrl);
                resolve({ url: URL.createObjectURL(blob), ext: 'png', size: blob.size });
            });
            return;
        }

        // Стандартна конвертація через canvas
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                var c = document.createElement('canvas');
                c.width = img.width; c.height = img.height;
                var ctx = c.getContext('2d');
                // Білий фон для форматів без альфа
                if (format === 'jpeg') {
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, c.width, c.height);
                }
                ctx.drawImage(img, 0, 0);

                var result, blob;
                if (format === 'svg-export') {
                    result = rasterToSvg(c);
                    blob = dataURItoBlob(result);
                } else {
                    result = c.toDataURL(mime, quality);
                    blob = dataURItoBlob(result);
                }
                resolve({ url: URL.createObjectURL(blob), ext: ext, size: blob.size });
            };
            img.onerror = function() { reject(new Error('Cannot decode image')); };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ── UI helpers ──
function showFiles(files) {
    currentFiles = Array.from(files);
    isBatch = currentFiles.length > 1;

    if (isBatch) {
        // Batch mode
        fileInfo.hidden = true;
        batchList.hidden = false;
        batchList.innerHTML = '<div class="batch-count">📁 ' + currentFiles.length + ' файлів вибрано</div>'
            + currentFiles.map(function(f, i) {
                return '<div class="batch-item" id="bitem-' + i + '">'
                    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>'
                    + '<span class="batch-name">' + f.name + '</span>'
                    + '<span class="batch-size">' + formatBytes(f.size) + '</span>'
                    + '<span class="batch-status" id="bstat-' + i + '">⏳</span>'
                    + '</div>';
            }).join('');
    } else {
        batchList.hidden = true;
        fileInfo.hidden = false;
        fileName.textContent = currentFiles[0].name;
        fileSize.textContent = formatBytes(currentFiles[0].size);
    }

    convertControls.hidden = false;
    convertActions.hidden = false;
    convertBtn.disabled = false;
    downloadBtn.hidden = true;
    progressWrap.hidden = true;
}

setupDragDrop(dropZone, fileInput, function(file) { showFiles([file]); });

fileInput.addEventListener('change', function() {
    if (this.files && this.files.length > 0) showFiles(this.files);
});

qualityRange.addEventListener('input', function() {
    qualityValue.textContent = this.value;
});

clearFileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    currentFiles = [];
    fileInput.value = '';
    fileInfo.hidden = true;
    batchList.hidden = true;
    convertControls.hidden = true;
    convertActions.hidden = true;
    downloadBtn.hidden = true;
    progressWrap.hidden = true;
    convertBtn.disabled = true;
});

// ── КОНВЕРТАЦІЯ ──
convertBtn.addEventListener('click', function() {
    if (!currentFiles.length) { alert('Виберіть файл!'); return; }

    var format  = formatSelect.value;
    var quality = parseInt(qualityRange.value) / 100;
    var T = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];

    progressWrap.hidden = false;
    progressFill.style.width = '0%';
    progressLabel.textContent = T.prog_converting || 'Converting...';
    convertBtn.disabled = true;
    downloadBtn.hidden = true;

    if (isBatch && currentFiles.length > 1) {
        // ── BATCH ──
        var total = currentFiles.length;
        var done  = 0;
        var links = [];

        function processNext(i) {
            if (i >= total) {
                // Всі готові — zip через download по одному або zip
                progressFill.style.width = '100%';
                progressLabel.textContent = T.prog_done || 'Done! ' + total + ' files';
                convertBtn.disabled = false;

                // Якщо один файл — прямий лінк, якщо багато — завантажуємо всі
                if (links.length === 1) {
                    downloadBtn.href = links[0].url;
                    downloadBtn.download = links[0].name;
                    downloadBtn.hidden = false;
                } else {
                    // Завантажуємо файли послідовно через мікрозатримку
                    links.forEach(function(l, idx) {
                        setTimeout(function() {
                            var a = document.createElement('a');
                            a.href = l.url; a.download = l.name;
                            document.body.appendChild(a); a.click();
                            setTimeout(function() { a.remove(); URL.revokeObjectURL(l.url); }, 1000);
                        }, idx * 400);
                    });
                    progressLabel.textContent = '✅ ' + total + ' файлів завантажуються...';
                }
                return;
            }

            var stat = document.getElementById('bstat-' + i);
            if (stat) stat.textContent = '⚙️';

            convertFile(currentFiles[i], format, quality).then(function(res) {
                done++;
                if (stat) { stat.textContent = '✅'; stat.className = 'batch-status done'; }
                var origName = currentFiles[i].name.replace(/\.[^/.]+$/, '');
                links.push({ url: res.url, name: origName + '_cx.' + res.ext });
                progressFill.style.width = (done / total * 100) + '%';
                processNext(i + 1);
            }).catch(function(err) {
                done++;
                if (stat) { stat.textContent = '❌'; stat.className = 'batch-status err'; }
                progressFill.style.width = (done / total * 100) + '%';
                processNext(i + 1);
            });
        }

        processNext(0);

    } else {
        // ── SINGLE FILE ──
        progressFill.style.width = '20%';
        convertFile(currentFiles[0], format, quality).then(function(res) {
            progressFill.style.width = '100%';
            progressLabel.textContent = (T.prog_done || 'Done!') + ' (' + formatBytes(res.size) + ')';

            var origName = currentFiles[0].name.replace(/\.[^/.]+$/, '');
            downloadBtn.href     = res.url;
            downloadBtn.download = origName + '_converted.' + res.ext;
            downloadBtn.hidden   = false;
            convertBtn.disabled  = false;

            setTimeout(function() { progressWrap.hidden = true; }, 2500);
        }).catch(function(err) {
            progressLabel.textContent = '❌ ' + (err.message || 'Error');
            progressFill.style.width = '0%';
            convertBtn.disabled = false;
        });
    }
});



// ── PRIVACY TOOLTIP POSITIONING ──────────────────
(function() {
    var badge = document.querySelector('.privacy-badge');
    var tip   = document.querySelector('.privacy-tooltip');
    if (!badge || !tip) return;

    badge.addEventListener('mouseenter', function() {
        var r = badge.getBoundingClientRect();
        // Показати над кнопкою
        tip.style.left = Math.max(8, r.left) + 'px';
        tip.style.top  = (r.top - tip.offsetHeight - 10) + 'px';
        // Якщо вилазить вгору — показати знизу
        if (r.top - tip.offsetHeight - 10 < 8) {
            tip.style.top = (r.bottom + 10) + 'px';
        }
    });
})();

// ── ІНІЦІАЛІЗАЦІЯ МОВИ ────────────────────────────
(function() {
    var saved = localStorage.getItem('cx-lang');
    var browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    var supported = ['en', 'uk', 'de'];
    var lang = supported.indexOf(saved) >= 0 ? saved
             : supported.indexOf(browserLang) >= 0 ? browserLang
             : 'en';
    applyLang(lang);
})();

// ── HAMBURGER MENU ────────────────────────────────
(function() {
    var ham     = document.getElementById('hamburger');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (!ham || !sidebar) return;

    function openSidebar() {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('open');
        ham.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        ham.classList.remove('open');
        document.body.style.overflow = '';
    }

    ham.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Закрити при кліку на nav item (мобілка)
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) closeSidebar();
        });
    });
})();

// ── UPSCALE SECTION ───────────────────────────────
(function() {
    var dropZone     = document.getElementById('dropZoneUpscale');
    var fileInput    = document.getElementById('fileInputUpscale');
    var controls     = document.getElementById('upscaleControls');
    var upscaleBtn   = document.getElementById('upscaleBtn');
    var downloadBtn  = document.getElementById('downloadUpscaleBtn');
    var scaleSelect  = document.getElementById('scaleSelect');
    var origSizeEl   = document.getElementById('origSize');
    var newSizeEl    = document.getElementById('newSize');
    var progressWrap = document.getElementById('upscaleProgress');
    var progressFill = document.getElementById('upscaleProgressFill');
    var progressLabel= document.getElementById('upscaleProgressLabel');
    var methodTabs   = document.querySelectorAll('#methodTabs .method-tab');
    var aiNotice     = document.getElementById('aiNotice');
    var canvas       = document.getElementById('upscaleCanvas');

    if (!dropZone || !fileInput || !upscaleBtn) return;

    var currentFile = null;
    var currentMethod = 'lanczos';

    // Method tabs — event delegation (працює навіть якщо секція hidden)
    var methodTabsContainer = document.getElementById('methodTabs');
    if (methodTabsContainer) {
        methodTabsContainer.addEventListener('click', function(e) {
            var tab = e.target.closest('.method-tab');
            if (!tab) return;
            document.querySelectorAll('#methodTabs .method-tab').forEach(function(t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            currentMethod = tab.dataset.method;
            if (aiNotice) aiNotice.hidden = (currentMethod !== 'ai');
        });
    }

    function setFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        currentFile = file;
        controls.hidden = false;
        downloadBtn.hidden = true;
        if (progressWrap) progressWrap.hidden = true;

        var img = new Image();
        img.onload = function() {
            if (origSizeEl) origSizeEl.textContent = img.width + '×' + img.height;
            updateSizePreview(img.width, img.height);
            URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(file);

        // Drop zone visual
        dropZone.classList.add('has-file');
        var main = dropZone.querySelector('.drop-main');
        if (main) main.textContent = file.name;
    }

    function updateSizePreview(w, h) {
        var scale = parseInt(scaleSelect ? scaleSelect.value : 2);
        if (newSizeEl) newSizeEl.textContent = (w * scale) + '×' + (h * scale);
    }

    if (scaleSelect) scaleSelect.addEventListener('change', function() {
        if (!currentFile) return;
        var img = new Image();
        img.onload = function() { updateSizePreview(img.width, img.height); URL.revokeObjectURL(img.src); };
        img.src = URL.createObjectURL(currentFile);
    });

    setupDragDrop(dropZone, fileInput, setFile);
    fileInput.addEventListener('change', function() { if (this.files[0]) setFile(this.files[0]); });

    // ── Lanczos upscale ──
    function lanczosUpscale(img, scale, cb) {
        var srcW = img.width, srcH = img.height;
        var dstW = srcW * scale, dstH = srcH * scale;

        // Малюємо оригінал в offscreen canvas
        var src = document.createElement('canvas');
        src.width = srcW; src.height = srcH;
        src.getContext('2d').drawImage(img, 0, 0);
        var srcData = src.getContext('2d').getImageData(0, 0, srcW, srcH).data;

        var dst = document.createElement('canvas');
        dst.width = dstW; dst.height = dstH;
        var dstCtx = dst.getContext('2d');
        var dstImg = dstCtx.createImageData(dstW, dstH);
        var dstData = dstImg.data;

        var a = 3; // Lanczos window

        function sinc(x) { if (x === 0) return 1; var px = Math.PI * x; return Math.sin(px) / px; }
        function lanczosKernel(x) { if (Math.abs(x) >= a) return 0; return sinc(x) * sinc(x / a); }

        // Process in chunks to not freeze UI
        var row = 0;
        var chunkSize = 20;

        function processChunk() {
            var end = Math.min(row + chunkSize, dstH);
            for (var y = row; y < end; y++) {
                for (var x = 0; x < dstW; x++) {
                    var srcX = x / scale;
                    var srcY = y / scale;
                    var r = 0, g = 0, b = 0, totalW = 0;
                    for (var ky = Math.floor(srcY) - a + 1; ky <= Math.floor(srcY) + a; ky++) {
                        for (var kx = Math.floor(srcX) - a + 1; kx <= Math.floor(srcX) + a; kx++) {
                            var px = Math.max(0, Math.min(srcW - 1, kx));
                            var py = Math.max(0, Math.min(srcH - 1, ky));
                            var w = lanczosKernel(srcX - kx) * lanczosKernel(srcY - ky);
                            var idx = (py * srcW + px) * 4;
                            r += srcData[idx]   * w;
                            g += srcData[idx+1] * w;
                            b += srcData[idx+2] * w;
                            totalW += w;
                        }
                    }
                    var di = (y * dstW + x) * 4;
                    dstData[di]   = Math.min(255, Math.max(0, Math.round(r / totalW)));
                    dstData[di+1] = Math.min(255, Math.max(0, Math.round(g / totalW)));
                    dstData[di+2] = Math.min(255, Math.max(0, Math.round(b / totalW)));
                    dstData[di+3] = 255;
                }
            }
            row = end;
            if (progressFill) progressFill.style.width = Math.round(row / dstH * 90) + '%';
            if (row < dstH) {
                setTimeout(processChunk, 0);
            } else {
                dstCtx.putImageData(dstImg, 0, 0);
                cb(dst);
            }
        }
        processChunk();
    }

    // ── Upscale button ──
    upscaleBtn.addEventListener('click', function() {
        if (!currentFile) return;
        var scale = parseInt(scaleSelect ? scaleSelect.value : 2);
        var T = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];

        upscaleBtn.disabled = true;
        downloadBtn.hidden = true;
        progressWrap.hidden = false;
        progressFill.style.width = '5%';
        progressLabel.textContent = T.prog_converting || 'Processing...';

        var img = new Image();
        img.onload = function() {
            if (currentMethod === 'ai') {
                // AI — поки fallback на Lanczos x2 + unsharp
                progressLabel.textContent = 'AI mode: using enhanced Lanczos...';
            }

            lanczosUpscale(img, scale, function(resultCanvas) {
                progressFill.style.width = '95%';
                progressLabel.textContent = T.prog_done || 'Done!';

                resultCanvas.toBlob(function(blob) {
                    var url = URL.createObjectURL(blob);
                    var origName = currentFile.name.replace(/\.[^/.]+$/, '');
                    downloadBtn.href = url;
                    downloadBtn.download = origName + '_x' + scale + '.png';
                    downloadBtn.hidden = false;
                    progressFill.style.width = '100%';
                    upscaleBtn.disabled = false;
                    setTimeout(function() { progressWrap.hidden = true; }, 2500);
                }, 'image/png');
            });
        };
        img.src = URL.createObjectURL(currentFile);
    });
})();
