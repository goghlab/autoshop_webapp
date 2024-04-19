import React from 'react';
import { Link } from 'react-router-dom';

function TermsPage() {
  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '20px', fontSize: '30px', fontWeight: 'bold', textAlign: 'center' }}>無人便利商店付款購買產品的條款</h1>

      <p style={{ textAlign: 'left' }}><strong>1. 本網站（「網站」）包括中匯智能科技有限公司委託萬智科技有限公司開發的無人便利商店應用程式（「應用程式」），由中匯智能科技有限公司營運。</strong></p>
      <p style={{ textAlign: 'left' }}>2. 產品描</p>
      <p style={{ textAlign: 'left' }}>本無人商店所出售產品均陳列於實體店鋪。無人便利商店將盡力確保本網站的內容和產品描述為準確和完整。不過我們不保證內容和產品描述均為準確、完整、最新和無誤。如果客戶覺得無人便利商店提供的產品與描述不符，請參閱我們的退貨政策。</p>
      <p style={{ textAlign: 'left' }}><strong>3. 條款及細則</strong></p>
      <p style={{ textAlign: 'left' }}>於瀏覽或使用網站、應用程式或服務計劃之前，務請閣下細閱條款和條件。一經瀏覽或使用網站、應用程式或服務計劃，即表示閣下同意受條款和條件約束。如閣下不同意所有條款和條件，則閣下不可瀏覽網站、應用程式或服務計劃或使用任何服務。閣下如對條款和條件或使用本公司的網站、應用程式或服務計劃或服務有任何疑問，應尋求獨立法律意見。閣下對條款和條件的同意屬閣下個人所有。除非本公司向閣下發出書面同意，否則閣仍須負責遵守條款和條件，且閣下不得將任何權利或責任轉移予任何其他人士。</p>
      <p style={{ textAlign: 'left' }}>4. 送貨政策</p>
      <p style={{ textAlign: 'left' }}>本無人便利商店所出售之產品均由客戶自行在商店選購及自行提取，本無人便利商店均不負責任何送貨服務。</p>
      <p style={{ textAlign: 'left' }}>5. 退款/退貨/訂單取消政策</p>
      <p style={{ textAlign: 'left' }}>客戶在購買產品後，一經結帳點串之後，恕不接受退換貨。若客戶對購買的產品有任何疑問，建議在結帳前仔細檢查產品狀態及數量。如發現產品有損壞或缺陷，請在當場與店內工作人員聯繫，以便進行處理。</p>
      <p style={{ textAlign: 'left' }}>6. 責任限制</p>
      <p style={{ textAlign: 'left' }}>無人便利商店對於客戶在購買產品時出現的任何損失或損害，不承擔責任。為了客戶的安全，請勿將任何貴重物品或現金放置於無人便利商店內。</p>
      <p style={{ textAlign: 'left' }}>7. 聯絡資料</p>
      <p style={{ textAlign: 'left' }}>如閣下對條款和條件有任何疑問，請透過 info@sinoexpresshk.com 聯絡本公司。</p>
      <p style={{ textAlign: 'left' }}>8. 結帳及付款流程</p>
      <p style={{ textAlign: 'left' }}>客戶可以使用信用卡或行動支付等方式進行付款。付款後，客戶將獲得購買產品的權利。</p>
      <p style={{ textAlign: 'left' }}>9. 法律責任限制</p>
      <p style={{ textAlign: 'left' }}>本公司及本公司的高級職員、代理商或特許人概不就以任何方式與服務有關的任何類型的附帶、間接、相應、特殊、懲罰性或懲戒性賠償（包括收益或利潤損失、業務流失或數據遺失）或因服務的錯誤、遺漏、中斷或其他不準確（包括但不限於因違反任何保證或本條款和條件的其他條款）而產生的任何申索、損失或傷害承擔責任，即使有關損害、申索、損失或傷害已預見或可預見。對本公司提出的任何申索須以閣下就使用服務所支付的金額（如有）為限。</p>
      <p style={{ textAlign: 'left' }}>10. 個人資料</p>
      <p style={{ textAlign: 'left' }}>閣下透過網站、應用程式或服務計劃提交的個人資料受本公司的個人資料私隱政策及聲明規管。</p>
      <p style={{ textAlign: 'left' }}>11. 管轄法律及司法管轄權</p>
      <p style={{ textAlign: 'left' }}>條款和條件、本公司向閣下提供服務的任何獨立協議，以及由此產生或與之有關的任何爭議或申索（包括非合約爭議或申索）或其標的事項或組成須受香港特別行政區（「香港特區」）的法律管轄及按其詮釋。</p>
      <p style={{ textAlign: 'left' }}>閣下及本公司均不可撤銷地同意，香港特區法院對解決因條款和條件、服務或其標的事項或組成而產生或與之有關的任何爭議或申索（包括非合約爭議或申索）擁有專有司法管轄權。</p>

      {/* Back Button */}
      <Link to="/" style={{ textDecoration: 'none', marginTop: '20px' }}>
        <button style={{ fontSize: '15px', textDecoration: 'underline', cursor: 'pointer' }}>
          返回上一頁
        </button>
      </Link>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
};

export default TermsPage;
