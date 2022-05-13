import React, { Fragment, useContext} from 'react' ;//racf
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import ContactContext from '../../context/contact/contactContext';


 const Navbar = ({title, icon}) => {
     const authContext = useContext(AuthContext);
     const contactContext = useContext(ContactContext);

     const { isAuthenticated, logout, user } = authContext;
     const{ clearContacts } = contactContext;
     
     const onLogout = () => {
         logout();
         clearContacts();
     }

     const authLinks = (
         <Fragment>
             <li>Hello { user && user.name }</li>
             <li>
                 <a onClick={onLogout} href = "#!">
                    <i className='fas fa-sign-out-alt'></i>
                    <span className='hide-sm'>Logout</span>
                 </a>
             </li>
         </Fragment>
     );

     const guestLinks = (
        <Fragment>
            <li>
                <Link to={ '/login'}>Login</Link>
            </li>
            <li>
                <Link to={'/register'}>Register</Link>
            </li>
        </Fragment>
    );

  return (
    <div className='navbar bg-primary'>
        <h1>
            <a href='/'>
                <i className={ icon }/> {title}
            </a>
        </h1>
        <ul>
            <li>
                <a href={'/about'}>About</a>
            </li>
            {isAuthenticated ? authLinks : guestLinks }
        </ul>
    </div>
  );
};

Navbar.propTypes = {
    title: PropTypes.string.isRequired, //ptsr
    icon: PropTypes.string, //pts
};

Navbar.defaultProps = {
    title: 'Contact Keeper',
    icon: 'fa-solid fa-id-card-alt' //default icons
};

export default Navbar;
