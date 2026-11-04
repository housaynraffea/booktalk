import Navbar from '@/common/components/global/navbar';
import { useSettings } from '@/common/context/SettingsContext';
import '@/common/styles/index.css';
import '@/common/styles/settings.css';

const Settings = () => {

  const {
    theme, setTheme, 
    showRecommended, setShowRecommended, 
    showPopular, setShowPopular, 
    showCover, setShowCover, 
    showProfilePicture, setShowProfilePicture
  } = useSettings();
  
  return (
    <div>
        <Navbar/>
        <div>
          <div className="settingsSidebar">
            <h2>Content</h2>
            <a href="#account">Account</a>
            <a href="#home">Home</a>
            <a href="#search">Search</a>
          </div>

          <div className="settingsContent">
            <h1>Settings</h1>

            <h2>Account</h2>
            <div id="account" className="settingsAccount">
              <p>Change/Edit profile picture</p>
              <p>Edit display name</p>
              <p>Edit username</p>
              <p>Edit bio</p>
              <p>Change favourite book</p>
              <p>Change email</p>
              <p>Change password</p>
            </div>
            
            <h2>Home</h2>
            <div id="home" className="settingsHome">
              <div className="settingsItem">
                <p>Theme: </p>
                <select 
                  value={theme} 
                  onChange={e => setTheme(e.target.value)}>
                  <option value="dark">Dark mode</option>
                  <option value="light">Light mode</option>
                </select>
              </div>

              <div className="settingsItem">
                <input 
                  type="checkbox" 
                  checked={showRecommended} 
                  onChange={e => setShowRecommended(e.target.checked)}/>
                <p>Show recommended books</p>
              </div>

              <div className="settingsItem">
                <input
                  type="checkbox"
                  checked={showPopular}
                  onChange={e => setShowPopular(e.target.checked)}/>
                <p>Show popular books</p>
              </div>
            </div>
            
            <h2>Search</h2>
            <div id="search" className="settingsSearch">
              <div className="settingsItem">
                <input 
                  type="checkbox"
                  checked={showCover}
                  onChange={e => setShowCover(e.target.checked)}/>
                <p>Include book cover when searching books</p>
              </div>

              <div className="settingsItem">
                <input 
                  type="checkbox"
                  checked={showProfilePicture}
                  onChange={e => setShowProfilePicture(e.target.checked)}/>
                <p>Include profile picture when searching accounts</p>
              </div>
            </div>

          </div>
        </div>
    </div>
  );
};

export default Settings;