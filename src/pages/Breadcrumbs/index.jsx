import PropTypes from 'prop-types';
import { Children, Fragment } from 'react';
// import './Breadcrumbs.css';

export const Breadcrumbs = ({ children, separate = '/', className = '' }) => {
    const childList = Children.toArray(children);

    return (
        <div className={('breadcrumbs', className)}>
            <style>
                {`
            .breadcrumbs {
                display: flex;
                align-items: center;
                gap: 4px;
              }
          `}
            </style>
            {childList.map((item, index) => (
                <Fragment key={index}>
                    {item}
                    {index < childList.length - 1 && separate}
                </Fragment>
            ))}
        </div>
    );
};

Breadcrumbs.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
    separate: PropTypes.node,
    className: PropTypes.string,
};
