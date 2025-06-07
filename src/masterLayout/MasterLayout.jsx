import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/authSlice";

const MasterLayout = ({ children }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth.user);

  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation(); // Hook to get the current route

  console.log("user", user)

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
                <Icon icon='mage:tag' className='menu-icon' />
                <span>Previous Question Paper</span>
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
                  <Icon
                    icon='icon-park-outline:setting-two'
                    className='menu-icon'
                  />
                  <span>Settings</span>
                </Link>

                <ul className='sidebar-submenu'>

                  <li>
                    <NavLink
                      to='/notification'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                      Notification
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to='/theme'
                      className={(navData) =>
                        navData.isActive ? "active-page" : ""
                      }
                    >
                      <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "}
                      Theme
                    </NavLink>
                  </li>

                </ul>
              </li>
            )}



            {/* Role & Access Dropdown */}
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
                <li>
                  <NavLink
                    to='/assign-role'
                    className={(navData) =>
                      navData.isActive ? "active-page" : ""
                    }
                  >
                    <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "}
                    Assign Role
                  </NavLink>
                </li>
              </ul>
            </li>




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
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <Icon
                      icon='iconoir:bell'
                      className='text-primary-light text-xl'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                    <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Notifications
                        </h6>
                      </div>
                      <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                        05
                      </span>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <Icon
                              icon='bitcoin-icons:verify-outline'
                              className='icon text-xxl'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Congratulations
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <img
                              src='assets/images/notification/profile-1.png'
                              alt=''
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Ronald Richards
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              You can stitch between artboards
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            AM
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Arlene McCoy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <img
                              src='assets/images/notification/profile-2.png'
                              alt=''
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Annette Black
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            DR
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Darlene Robertson
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                    </div>
                    <div className='text-center py-12 px-16'>
                      <Link
                        to='#'
                        className='text-primary-600 fw-semibold text-md'
                      >
                        See All Notification
                      </Link>
                    </div>
                  </div>
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
