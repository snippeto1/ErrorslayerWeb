# Error Slayer — საიტი

სამი გვერდი, ნულოვანი დამოკიდებულება, ყველაფერი ერთ ფოლდერში:

- `index.html` — მთავარი გვერდი
- `privacy.html` — Privacy Policy (App Store-ის ველისთვის)
- `support.html` — Support (App Store-ის ველისთვის)
- `app-store-badge.svg` — დროებითი ბეჯი; ოფიციალური ჩაანაცვლებ

## უფასოდ ატვირთვა GitHub Pages-ზე (10 წუთი)

1. შედი github.com-ზე (ანგარიში უფასოა) → **New repository** → სახელი `error-slayer-site`, Public → Create.
2. რეპოს გვერდზე **Add file → Upload files** → ამ ფოლდერის ყველა ფაილი ჩააგდე → **Commit changes**.
3. რეპოში **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, Folder: `/ (root)` → Save.
4. ერთ-ორ წუთში საიტი ცოცხალია:
   `https://<შენი-github-სახელი>.github.io/error-slayer-site/`

App Store Connect-ში მაშინ:
- **Privacy Policy URL** → `.../error-slayer-site/privacy.html`
- **Support URL** → `.../error-slayer-site/support.html`
- **Marketing URL** → `.../error-slayer-site/`

## რა შეავსო ატვირთვამდე (ფაილებში `PLACEHOLDER`-ით არის მონიშნული)

- `[YOUR NAME OR COMPANY]`, `[Postal address]`, `[contact@yourdomain]`, `[REGION]`, `[URL OF THIS PAGE]` — privacy.html-ში
- `[contact@yourdomain]` — support.html-ში და footer-ში
- App Store-ის ბმული — index.html-ში ორ ადგილას `href="#"`; აპის გამოქვეყნების შემდეგ
- Instagram-ის ბმული footer-ში — თუ გვერდი არ გაქვს, წაშალე ეს `<a>`

## სურათები (არასავალდებულო, მაგრამ ღირს)

- `logo.png` — ჩააგდე ფოლდერში და index.html-ში კომენტარის მიხედვით ტექსტური ლოგო სურათით შეცვალე
- `shot-1.png`, `shot-2.png`, `shot-3.png` — სქრინშოტები; index.html-ში სამი ნაცრისფერი ყუთი ამით იცვლება
- `favicon.png` — აპის icon.png-ის 64×64 ვერსია
- Apple-ის ოფიციალური ბეჯი: developer.apple.com/app-store/marketing/guidelines → ჩამოტვირთე SVG, დაარქვი `app-store-badge.svg` და ჩაანაცვლე

## დომენი: errorslayer.com

`CNAME` ფაილი უკვე ფოლდერშია — GitHub Pages მას კითხულობს. რეგისტრატორის DNS-ში:

```
A      @     185.199.108.153
A      @     185.199.109.153
A      @     185.199.110.153
A      @     185.199.111.153
CNAME  www   <შენი-github-სახელი>.github.io
```

მერე რეპო → Settings → Pages → Custom domain: `errorslayer.com` → Save → (რამდენიმე წუთი/საათი) → Enforce HTTPS.

App Store Connect-ში: Privacy Policy URL `https://errorslayer.com/privacy.html`, Support URL `https://errorslayer.com/support.html`, Marketing URL `https://errorslayer.com`.
