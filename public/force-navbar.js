// Bu script, sayfa yüklendikten sonra navbarı doğrudan DOM'a ekler
// React dışı basit bir çözüm
document.addEventListener('DOMContentLoaded', function() {
  // 1 saniye bekle (diğer DOM manipülasyonları tamamlansın)
  setTimeout(function() {
    // Sayfada zaten böyle bir navbar var mı kontrol et
    if (!document.querySelector('.lusso-forced-navbar')) {
      console.log('Lusso navbar zorla ekleniyor...');
      
      // Navbar HTML'i
      const navbarHTML = `
        <header class="lusso-forced-navbar" style="position: fixed; top: 0; left: 0; width: 100%; background-color: #0e4e25; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 9999999; font-family: Arial, sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 15px; height: 60px;">
            <div>
              <a href="/nike" style="color: #fff; text-decoration: none; font-size: 22px; font-weight: bold;">LUSSO WFC</a>
            </div>
            
            <nav style="display: flex; gap: 20px;">
              <a href="/nike/team" style="color: #fff; text-decoration: none; font-weight: 500; padding: 5px 0;">Takım</a>
              <a href="/nike/players" style="color: #fff; text-decoration: none; font-weight: 500; padding: 5px 0;">Oyuncular</a>
              <a href="/nike/fixtures" style="color: #fff; text-decoration: none; font-weight: 500; padding: 5px 0;">Maçlar</a>
              <a href="/nike/news" style="color: #fff; text-decoration: none; font-weight: 500; padding: 5px 0;">Haberler</a>
              <a href="/nike/shop" style="color: #fff; text-decoration: none; font-weight: 500; padding: 5px 0;">Mağaza</a>
            </nav>
          </div>
        </header>
      `;
      
      // Navbarı oluştur ve body'nin başına ekle
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = navbarHTML.trim();
      const navbarElement = tempDiv.firstChild;
      document.body.insertBefore(navbarElement, document.body.firstChild);
      
      // Sayfa içeriğine margin ekle
      document.body.style.marginTop = '60px';
      
      // Hover efekti için JavaScript
      document.querySelectorAll('.lusso-forced-navbar nav a').forEach(function(link) {
        link.addEventListener('mouseover', function() {
          this.style.color = '#D4AF37'; // Lusso gold
        });
        
        link.addEventListener('mouseout', function() {
          this.style.color = '#fff';
        });
      });
      
      console.log('Lusso navbar başarıyla eklendi!');
    }
  }, 1000);
  
  // Her 3 saniyede bir navbar durumunu kontrol et
  // Bazı dış scriptler navbarı kaldırabilir
  setInterval(function() {
    if (!document.querySelector('.lusso-forced-navbar')) {
      console.log('Lusso navbar kaybolmuş, tekrar ekleniyor...');
      // Bu durumda recursive olarak DOMContentLoaded event'ini tekrar tetikle
      document.dispatchEvent(new Event('DOMContentLoaded'));
    }
  }, 3000);
});
