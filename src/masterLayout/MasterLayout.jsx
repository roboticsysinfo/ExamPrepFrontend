import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/authSlice";
import { fetchDoubtNotifications } from "../redux/slices/notificationSlice";

const MasterLayout = ({ children }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth.user);

  const { doubtNotifications = [] } = useSelector((state) => state.notifications);
  // Calculate unread count directly
  const unreadCount = doubtNotifications.filter((n) => !n.isRead).length;
  const instituteId = user?.instituteId


  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); // Hook to get the current route


  useEffect(() => {
    if (instituteId) {
      dispatch(fetchDoubtNotifications(instituteId));
    }
  }, [instituteId, dispatch]);


  useEffect(() => {

    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };



    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logout successful');
    navigate('/login');
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
              ? "sidebar sidebar-open"
              : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type='button'
          className='sidebar-close-btn'
        >
          <Icon icon='radix-icons:cross-2' />
        </button>
        <div>
          <Link to='/' className='sidebar-logo'>
            <img
              src='assets/images/logo.png'
              alt='site logo'
              className='light-logo'
            />
            <img
              src='assets/images/logo-light.png'
              alt='site logo'
              className='dark-logo'
            />
            <img
              src='assets/images/logo-icon.png'
              alt='site logo'
              className='logo-icon'
            />
          </Link>
        </div>
        <div className='sidebar-menu-area'>
          <ul className='sidebar-menu' id='sidebar-menu'>
            <li className='dropdown'>

              <Link to='#'>
                <Icon
                  icon='solar:home-smile-angle-outline'
                  className='menu-icon'
                />
                <span>Main</span>
              </Link>

              <ul className='sidebar-submenu'>

                <li>
                  <NavLink
                    to='/'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/student-registration'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    New Student Registration
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/students'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    Students
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to='/admission-query'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-purple w-auto' />{" "}
                    Admission Query
                  </NavLink>
                </li>

              </ul>
            </li>

            <li className='sidebar-menu-group-title'>Pages</li>

            <li>
              <NavLink
                to='/exam-categories'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:file' className='menu-icon' />
                <span>Exam Categories</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/exams'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:file' className='menu-icon' />
                <span>Exams</span>
              </NavLink>
            </li>


            <li>
              <NavLink
                to='/subjects'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:folder' className='menu-icon' />
                <span>Subjects</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/topics'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:link' className='menu-icon' />
                <span>Topics</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/questions'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:tag' className='menu-icon' />
                <span>Questions</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to='/tests'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:tag' className='menu-icon' />
                <span>Mock Tests</span>
              </NavLink>
            </li>


            <li>
              <NavLink
                to='/practice-tests'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:tag' className='menu-icon' />
                <span>Practice Tests</span>
              </NavLink>
            </li>


            <li>
              <NavLink
                to='/previous-question-paper'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <Icon icon='mage:file' className='menu-icon' />
                <span>Previous Question Paper</span>
              </NavLink>
            </li>


            <li>
              <NavLink
                to='/students-doubts'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9588 14.7235C8.35881 14.7235 4.33881 17.6519 4.33881 21.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M11.9588 11.4653C12.8215 11.4673 13.6655 11.2134 14.3838 10.7358C15.1021 10.2581 15.6625 9.57825 15.994 8.78217C16.3256 7.98609 16.4133 7.1096 16.2462 6.26365C16.0791 5.41769 15.6647 4.6403 15.0553 4.02987C14.446 3.41944 13.6691 3.00342 12.8231 2.83447C11.977 2.66551 11.0999 2.75122 10.3026 3.08075C9.50534 3.41027 8.82381 3.9688 8.34429 4.68562C7.86476 5.40245 7.6088 6.24535 7.6088 7.10764C7.60879 8.26163 8.06678 9.3685 8.88227 10.1854C9.69777 11.0024 10.8042 11.4626 11.9588 11.4653Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M15.3181 15.9191C15.4663 15.5958 15.7182 15.3312 16.0337 15.1671C16.3493 15.003 16.7106 14.9488 17.0604 15.0131C17.3001 15.0499 17.5278 15.1424 17.7252 15.2831C17.9226 15.4238 18.0843 15.6088 18.1973 15.8233C18.2786 15.9949 18.3227 16.1817 18.3267 16.3716C18.3307 16.5614 18.2945 16.7499 18.2204 16.9248C18.1464 17.0996 18.0362 17.2568 17.8971 17.386C17.758 17.5152 17.5931 17.6136 17.4133 17.6745C17.2298 17.7441 17.0711 17.8665 16.9572 18.0262C16.8432 18.1859 16.7791 18.3757 16.773 18.5718V18.942" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                  <path d="M16.7445 20.9868H16.7471" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>{' '}
                <span>Students Doubts</span>
              </NavLink>
            </li>


            <li>
              <NavLink
                to='/leaderboard'
                className={(navData) => (navData.isActive ? "active-page" : "")}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.0799 2.75234H8.92013C8.40207 2.72706 7.89493 2.90712 7.5088 3.25343C7.12266 3.59974 6.88868 4.08436 6.85764 4.60211V10.6786C6.87728 11.6782 7.1693 12.6534 7.70225 13.4993C8.23519 14.3451 8.98885 15.0295 9.88201 15.4787C10.5344 15.8245 11.2616 16.0053 12 16.0053C12.7384 16.0053 13.4656 15.8245 14.118 15.4787C15.0111 15.0295 15.7648 14.3451 16.2977 13.4993C16.8307 12.6534 17.1227 11.6782 17.1423 10.6786V4.60211C17.1113 4.08436 16.8773 3.59974 16.4912 3.25343C16.1051 2.90712 15.5979 2.72706 15.0799 2.75234Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M17.1423 4.6021H19.1956C19.7121 4.57933 20.2169 4.76051 20.601 5.10656C20.9851 5.45261 21.2178 5.93579 21.2488 6.45187C21.2458 7.6116 20.9466 8.75134 20.3794 9.76295C19.7853 10.8088 18.9556 11.7018 17.9562 12.3711L17.1423 12.926L16.3469 13.407" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M6.85764 4.6021H4.8044C4.28789 4.57933 3.78313 4.76051 3.39901 5.10656C3.0149 5.45261 2.78221 5.93579 2.75116 6.45187C2.75417 7.6116 3.05343 8.75134 3.62055 9.76295C4.21469 10.8088 5.04435 11.7018 6.04374 12.3711L6.85764 12.926L7.65304 13.407" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M9.94675 18.4753V15.5065" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M14.0532 18.4753V15.5065" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M8.80915 18.4753H15.1908C15.7084 18.4753 16.2048 18.6809 16.5708 19.0469C16.9367 19.4129 17.1423 19.9093 17.1423 20.4268V20.7598C17.1423 20.8898 17.0907 21.0145 16.9988 21.1064C16.9068 21.1983 16.7822 21.25 16.6522 21.25H7.34783C7.21782 21.25 7.09314 21.1983 7.00122 21.1064C6.90929 21.0145 6.85764 20.8898 6.85764 20.7598V20.4268C6.85764 19.9093 7.06325 19.4129 7.42923 19.0469C7.7952 18.6809 8.29158 18.4753 8.80915 18.4753Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  <path d="M12.1428 10.3083L13.3233 10.9286C13.3731 10.9548 13.4294 10.9665 13.4856 10.9624C13.5418 10.9582 13.5957 10.9384 13.6411 10.9052C13.6866 10.8719 13.7219 10.8266 13.7429 10.7743C13.7639 10.722 13.7698 10.6649 13.7599 10.6094L13.5341 9.29646C13.5257 9.24805 13.5292 9.19832 13.5444 9.1516C13.5597 9.10489 13.5861 9.06261 13.6214 9.02845L14.576 8.09796C14.6166 8.05887 14.6454 8.00918 14.6591 7.95454C14.6729 7.89989 14.671 7.84248 14.6538 7.78883C14.6365 7.73519 14.6046 7.68746 14.5615 7.65108C14.5185 7.6147 14.4661 7.59112 14.4104 7.58303L13.0914 7.39331C13.0432 7.38607 12.9974 7.36721 12.9581 7.33836C12.9187 7.30951 12.887 7.27153 12.8656 7.22769L12.2633 6.02317C12.2386 5.97226 12.2001 5.92932 12.1522 5.89928C12.1043 5.86924 12.0488 5.8533 11.9923 5.8533C11.9357 5.8533 11.8803 5.86924 11.8324 5.89928C11.7844 5.92932 11.7459 5.97226 11.7213 6.02317L11.119 7.22769C11.0976 7.27153 11.0658 7.30951 11.0265 7.33836C10.9872 7.36721 10.9414 7.38607 10.8932 7.39331L9.59227 7.58303C9.53626 7.59065 9.48352 7.61389 9.44009 7.65008C9.39667 7.68628 9.36431 7.73396 9.34671 7.78769C9.32912 7.84141 9.327 7.899 9.34061 7.95387C9.35421 8.00874 9.38299 8.05868 9.42364 8.09796L10.3782 9.02845C10.4135 9.06261 10.44 9.10489 10.4552 9.1516C10.4704 9.19832 10.474 9.24805 10.4656 9.29646L10.2397 10.6094C10.2298 10.6649 10.2358 10.722 10.2568 10.7743C10.2777 10.8266 10.313 10.8719 10.3585 10.9052C10.404 10.9384 10.4579 10.9582 10.5141 10.9624C10.5702 10.9665 10.6265 10.9548 10.6763 10.9286L11.8568 10.3083C11.9007 10.2845 11.9499 10.2721 11.9998 10.2721C12.0497 10.2721 12.0989 10.2845 12.1428 10.3083Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                {' '}
                <span>Leaderboard</span>
              </NavLink>
            </li>


            {!(user.role === 'admin' || user.role === 'teacher') && (
              <li>
                <NavLink
                  to='/institutes'
                  className={(navData) => (navData.isActive ? 'active-page' : '')}
                >
                  <Icon icon='mage:tag' className='menu-icon' />
                  <span>Manage Institutes</span>
                </NavLink>
              </li>
            )}

            {!(user.role === 'admin' || user.role === 'teacher') && (

              <li className='dropdown'>
                <Link to='#'>
                  <Icon
                    icon='flowbite:users-group-outline'
                    className='menu-icon'
                  />
                  <span>Users</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                      to='/users-list'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      Users List
                    </NavLink>
                  </li>


                  <li>
                    <NavLink
                      to='/add-user'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-info-main w-auto' />{" "}
                      Add User
                    </NavLink>
                  </li>

                </ul>
              </li>

            )}


            {user.role !== 'teacher' && (

              <li className='dropdown'>
                <Link to='#'>
                  <i className='ri-user-settings-line' />
                  <span>Role &amp; Access</span>
                </Link>
                <ul className='sidebar-submenu'>
                  <li>
                    <NavLink
                      to='/role-access'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                      Role &amp; Access
                    </NavLink>
                  </li>

                </ul>
              </li>

            )}







          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className='navbar-header'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-4'>
                <button
                  type='button'
                  className='sidebar-toggle'
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon='iconoir:arrow-right'
                      className='icon text-2xl non-active'
                    />
                  ) : (
                    <Icon
                      icon='heroicons:bars-3-solid'
                      className='icon text-2xl non-active '
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type='button'
                  className='sidebar-mobile-toggle'
                >
                  <Icon icon='heroicons:bars-3-solid' className='icon' />
                </button>
                <form className='navbar-search'>
                  <input type='text' name='search' placeholder='Search' />
                  <Icon icon='ion:search-outline' className='icon' />
                </form>
              </div>
            </div>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-3'>
                {/* ThemeToggleButton */}
                <ThemeToggleButton />


                <div className='dropdown'>
                  <Link
                    to="/notification"
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center position-relative'
                    
                  >
                    <Icon
                      icon='iconoir:bell'
                      className='text-primary-light text-xl'
                    />

                    {/* 🔴 Badge for unread doubt notifications */}
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </div>


                {/* Notification dropdown end */}
                <div className='dropdown'>
                  <button
                    className='d-flex justify-content-center align-items-center rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src='assets/images/user.png'
                      alt='image_user'
                      className='w-40-px h-40-px object-fit-cover rounded-circle'
                    />
                  </button>

                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          {user?.name || "N/A"}
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                          {user?.role || "N/A"}
                        </span>
                      </div>
                      <button type='button' className='hover-text-danger'>
                        <Icon icon='radix-icons:cross-1' className='icon text-xl' />
                      </button>
                    </div>
                    <ul className='to-top-list'>
                      <li>
                        <button
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3 w-100 bg-transparent border-0 text-start'
                          onClick={handleLogout}
                        >
                          <Icon icon='lucide:power' className='icon text-xl' />
                          Log Out
                        </button>
                      </li>
                    </ul>
                  </div>

                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className='dashboard-main-body'>{children}</div>

        {/* Footer section */}
        <footer className='d-footer'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <p className='mb-0'>© 2025 <a href="https://roboticsysinfo.com">RoboticSysInfo</a>. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </section >
  );
};

export default MasterLayout;
