import { BIO_MAX, getAccount, updateAccount, validateDisplayName, validateUsername } from '@/api/account';
import Navbar from '@/common/components/global/navbar';
import type { FavouriteBook } from '@/common/components/settings/favourite-book-picker';
import { useAuth } from '@/common/context/AuthContext';
import { useSettings } from '@/common/context/SettingsContext';
import '@/common/styles/index.css';
import '@/common/styles/settings.css';
import { useEffect, useState, type FormEvent } from 'react';
import FavouriteBookPicker from '@/common/components/settings/favourite-book-picker';

type AccountForm = {
  display_name: string;
  username: string;
  bio: string;
  favourite_book: FavouriteBook;
}

type Message = {
  kind: 'error' | 'success';
  text: string;
} | null;

const Settings = () => {
  const {
    theme, setTheme, 
    showRecommended, setShowRecommended, 
    showPopular, setShowPopular, 
    showCover, setShowCover, 
    showProfilePicture, setShowProfilePicture
  } = useSettings();
  
  const { user, isLoading: isAuthLoading, refreshUser, logout } = useAuth();
  const isLoggedIn = !isAuthLoading && user !== null;
  const [savedAccount, setSavedAccount] = useState<AccountForm | null>(null);
  const [form, setForm] = useState<AccountForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<Message>();

  useEffect(() => {
    if (!user) {
      setSavedAccount(null);
      setForm(null);
      setMessage(null);
      return;
    }

    const abortController = new AbortController();

    getAccount(user.account_id, abortController.signal)
      .then((account) => {
        if (!account) return;

        const loaded: AccountForm = {
          display_name: account.display_name,
          username: account.username,
          bio: account.bio ?? '',
          favourite_book: account.favourite_book_key ? {
            key: account.favourite_book_key,
            title: account.favourite_book_title ?? account.favourite_book_key,
            cover: account.favourite_book_cover
          } : null,
        };

        setSavedAccount(loaded);
        setForm(loaded);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setMessage({ kind: 'error', text: 'Could not load account'});
      });

      return () => abortController.abort();
  }, [user?.account_id]);

  const updateField = <K extends keyof AccountForm>(field: K, value: AccountForm[K]) => {
    setForm((current) => (current ? { ...current, [field]: value} : current));
    setMessage(null);
  }

  const is_dirty = form !== null && savedAccount !== null && 
    (form.display_name !== savedAccount.display_name ||
    form.username !== savedAccount.username ||
    form.bio !== savedAccount.bio ||
    form.favourite_book?.key !== savedAccount.favourite_book?.key);
  
  const handleLogout = async () => {
    try {
      await logout();
    }
    catch (error) {
      const text = error instanceof Error ? error.message : 'Could not log out';
      setMessage({ kind: 'error', text: text});
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;
    setMessage(null);

    const clean: AccountForm = {
      display_name: form.display_name.trim(),
      username: form.username.trim(),
      bio: form.bio.trim(),
      favourite_book: form.favourite_book,
    };

    const problem = 
      validateDisplayName(clean.display_name) ?? 
      validateUsername(clean.username) ??
      (clean.bio.length > BIO_MAX ? `Bio must be less than ${BIO_MAX} characters` : null);
    
    if (problem) {
      setMessage({ kind: 'error', text: problem});
      return;
    }

    setIsSaving(true);

    try {
      await updateAccount({
        display_name: clean.display_name,
        username: clean.username,
        bio: clean.bio,
        favourite_book_key: clean.favourite_book?.key ?? null
      });
      setSavedAccount(clean);
      setForm(clean);
      await refreshUser();
      setMessage({ kind: 'success', text: 'Saved changes' })
    }
    catch (error) {
      const text = error instanceof Error ? error.message : 'Could not save your changes';
      setMessage({ kind: 'error', text: text });
    }
    finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
        <Navbar/>
        <div>
          <div className="settingsSidebar">
            <h2>Content</h2>
            {isLoggedIn && <a href="#account">Account</a>}
            <a href="#home">Home</a>
            <a href="#search">Search</a>
          </div>

          <div className="settingsContent">
            <h1>Settings</h1>
            {isLoggedIn && (
              <>
                <h2>Account</h2>
                <p>This is how your profile will (almost) look for others</p>
                
                <div id="account" className="settingsAccount">
                  {isAuthLoading || (user && !form) ? (
                    <p>Loading...</p>
                  ) : !user ? (
                    <p>You need to log in to make changes to your account</p>
                  ) : form && (
                    <form onSubmit={handleSave}>
                      <div className="profilePanel">
                        <div className="profilePicture">
                          <img src="/buttons/ProfileButton.svg" width="250px" height="250px"/>
                        </div>
                        <div className="profileInfo">
                          <div className="profileInfoDisplayName">
                            <input
                              className="settingsField"
                              type="text"
                              value={form.display_name}
                              onChange={(e) => updateField('display_name', e.target.value)}
                            />
                          </div>

                          <div className="profileInfoUsername">
                            <p>@</p>
                            <input
                              className="settingsField"
                              type="text"
                              value={form.username}
                              spellCheck={false}
                              onChange={(e) => updateField('username', e.target.value)}
                            />
                          </div>

                          <div className="profileInfoBio">
                            <textarea
                              rows={8}
                              className="settingsField"
                              placeholder='Write something about yourself! Or anything, really!'
                              value={form.bio}
                              maxLength={BIO_MAX}
                              onChange={(e) => updateField('bio', e.target.value)}
                            />
                            <small>{form.bio.length}/{BIO_MAX}</small>
                          </div>
                        </div>
                        <div className="profileFavouriteBook">
                          <div className="profileFavouriteBookHeader">
                            <h4>Favourite book:</h4>
                          </div>
                          <div className="profileFavouriteBookContainer">
                            <FavouriteBookPicker
                              value={form.favourite_book}
                              onChange={(book) => updateField('favourite_book', book)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="settingsSaveRow">
                        <button type="submit" className="settingsSave" disabled={!is_dirty || isSaving}>
                          {isSaving ? "Saving" : "Save"}
                        </button>
                        {message && <p className={`settingsMessage-${message?.kind}`}>{message.text}</p>}
                      </div>
                    </form>
                  )}

                  <p>Change email</p>
                  <p>Change password</p>

                  <button type="button" onClick={() => handleLogout()}>Log out</button>

                </div>
              </>
            )}
            
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

              {isLoggedIn && (
                <div className="settingsItem">
                  <input 
                    type="checkbox" 
                    checked={showRecommended} 
                    onChange={e => setShowRecommended(e.target.checked)}/>
                  <p>Show recommended books</p>
                </div>
              )}

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