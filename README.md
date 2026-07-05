# OPOS Windows Proqramları (Restoran / Otel)

Bu qovluqda 2 kiçik Windows proqramının qaynaq kodu var:

- **cafe/** → açılışda birbaşa `https://cafe.opos.az` saytını göstərir (Restoran müştəriləri üçün)
- **hotel/** → açılışda birbaşa `https://hotel.opos.az` saytını göstərir (Otel müştəriləri üçün)

Hər ikisi ənənəvi brauzerə bənzər, sadəcə ünvan çubuğu, menyu və s. olmadan, birbaşa sizin sistemi açan pəncərədir. Müştəri bunu adi bir proqram kimi görür, "brauzer" olduğunu belə hiss etməz.

## Bunu necə `.exe` faylına çevirmək olar?

Mənim iş mühitimin şəbəkə girişi məhdud olduğu üçün faylı birbaşa bura yükləyə bilmədim, amma **GitHub Actions** vasitəsilə tamamilə pulsuz və avtomatik tərtib etmək mümkündür (proqramlaşdırma bilgisi tələb olunmur). Addım-addım:

1. **github.com**-da (yoxdursa) pulsuz hesab yaradın.
2. Yeni bir **repository** yaradın (məsələn adı: `opos-launcher`), **Private** seçə bilərsiniz.
3. Bu qovluqdakı bütün fayl və qovluqları (cafe, hotel, .github və s.) o repository-ə yükləyin:
   - Repo səhifəsində **"Add file" → "Upload files"** düyməsi ilə, və ya
   - Kompüterinizdə `git` varsa: `git init`, `git add .`, `git commit -m "ilk yükləmə"`, sonra repo-nun verdiyi `git remote add origin ...` və `git push` əmrləri ilə.
4. Yükləmə bitəndə GitHub avtomatik olaraq **Actions** tabında tərtib prosesini başladacaq (bir neçə dəqiqə çəkir).
5. Proses bitdikdən sonra Actions → ilgili "run" → aşağıda **Artifacts** hissəsindən:
   - `cafe-windows-installer` → Restoran proqramının quraşdırıcısı (.exe)
   - `hotel-windows-installer` → Otel proqramının quraşdırıcısı (.exe)
   faylını endirə bilərsiniz.
6. Bu `.exe` faylını müştərilərinizə göndərin/paylaşın — ikiqat klikləməklə quraşdırılır, masaüstündə qısayol yaranır.

> Qeyd: Bu proqram sadəcə internet vasitəsilə sizin mövcud saytınızı (cafe.opos.az / hotel.opos.az) göstərir, ona görə istifadə üçün internet bağlantısı lazımdır.

## Sonradan dəyişiklik etmək istəsəniz

`cafe/main.js` və ya `hotel/main.js` faylının başındakı bu sətirləri dəyişməklə URL-i, başlığı və icazə verilən domeni dəyişə bilərsiniz:

```js
const APP_URL = 'https://cafe.opos.az';
const APP_TITLE = 'OPOS Restoran';
const ALLOWED_HOST = 'opos.az';
```

Dəyişiklikdən sonra yenidən GitHub-a yükləsəniz (push), proqram avtomatik yenidən tərtib olunacaq.

## Əlavə istəklər üçün

- Öz loqonuzu ikonka (`icon.ico`) olaraq `cafe/` və `hotel/` qovluqlarına qoysanız, proqram özəl ikonka ilə görünəcək (hazırda standart Electron ikonkası istifadə olunur, `icon.ico` faylı yoxdursa avtomatik ötürülür).
- İstəsəniz mən avtomatik yenilənmə (auto-update), lisenziya/parol qorunması, və ya birbaşa printer/kassa inteqrasiyası kimi əlavələr də əlavə edə bilərəm — deyin, əlavə edim.
