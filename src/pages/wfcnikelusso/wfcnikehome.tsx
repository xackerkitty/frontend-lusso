import './components/css/wfcnikehome.css'; // This imports your CSS file
import FIFA_Logo from './components/media/associatedWith/fifa.png';
import ECA_Logo from './components/media/associatedWith/ECA.png';
import UEFA_Logo from './components/media/associatedWith/UEFA.png';
import WFCNavbar from './components/WFCNavbar';

const WFCNikeHome = () => {
    return (
      <div>
        <WFCNavbar />
        <div className="main_background">
          <div className="gradient_overlay"></div>
        </div>
        <div className="associated_with_bg">
          <div className="associated_content">
            <h2 className="associated_title">Associated with:</h2>
            <div className="associated_logos_container">
              <div className="associated_card">
                <img src={FIFA_Logo} alt="FIFA" />
              </div>
              <div className="associated_card">
                <img src={ECA_Logo} alt="ECA" />
              </div>
              <div className="associated_card">
                <img src={UEFA_Logo} alt="UEFA" />
              </div>
            </div>
          </div>
        </div>
        <div className="main_content">
          <div className="white_bg">
            <div className="next_matches_container">
              <h1>
                the site is currently under construction, please come back later
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
}

export default WFCNikeHome;