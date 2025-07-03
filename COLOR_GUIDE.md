# Lusso Renk Sistemi Rehberi

## Merkezi Renk Yönetimi

Lusso projesi, tüm renkleri tek bir merkezi kaynaktan (tailwind.config.js) yönetir. Aşağıdaki renk sınıflarını kullanmalısınız:

### Ana Renkler
- `text-lusso-primary`: Ana marka rengi (koyu orman yeşili #0e4e25)
- `text-lusso-secondary`: İkincil marka rengi (taze yeşil #4CAF50)
- `text-lusso-accent`: Vurgu rengi (canlı amber #ffb300)

### Durum Renkleri
- `text-lusso-warning`: Uyarı rengi (sıcak turuncu #f59e0b)
- `text-lusso-error`: Hata rengi (zengin kırmızı #ef4444)
- `text-lusso-success`: Başarı rengi (temiz zümrüt yeşil #10b981)
- `text-lusso-info`: Bilgi rengi (yumuşak mavi #3b82f6)

### Metin Renkleri
- `text-lusso-text`: Normal metin rengi (açık gri #d1d5db)
- `text-lusso-heading`: Başlık metni (beyaz #ffffff)

### Arka Plan Renkleri
- `bg-lusso-bg-dark`: Ana arka plan rengi (derin siyah #000000)
- `bg-lusso-bg-slate`: Alternatif koyu arka plan (koyu arduvaz #0f172a)
- `bg-lusso-bg-gray`: Gri tonlu arka plan (arduvaz gri #111827)

## Saydamlık ve Türevler

Tailwind'in saydamlık değerlerini bu renklerle kullanabilirsiniz:
- `text-lusso-text/70`: %70 opak metin rengi
- `bg-lusso-bg-dark/50`: %50 saydamlıkta arka plan

## Renk Değişikliği İçin

Renk değişikliği yapmak gerektiğinde sadece `tailwind.config.js` dosyasındaki ilgili değerleri değiştirin. Değişiklik tüm projeye otomatik olarak yansıyacaktır.

## Özel Durumlar

- Logolar ve görseller gibi dış kaynaklar orijinal renklerini koruyacaktır
- Hover ve active durumları için `hover:text-lusso-accent` gibi sınıflar kullanın

## Sık Yapılan Hatalar

- Tailwind'in varsayılan renk sınıflarını doğrudan kullanmak yerine daima lusso-ön ekli sınıfları kullanın
- Renk kodlarını inline olarak yazmak yerine daima merkezi renk sınıflarını kullanın
