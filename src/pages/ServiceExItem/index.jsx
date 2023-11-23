import PropTypes from 'prop-types';

export const ServiceExItem = ({ id, title, imgUrl, onClick }) => {
    return (
        <div className="service-wrapper">
            <style>
                {`
            .service-wrapper {
              cursor: default;
              overflow: hidden;
            }
            
            .service-wrapper:hover .service-image {
              transform: scale(1.1);
            }
            
            .service-wrapper:hover .service-title {
              color: #ccc;
            }

            .service-title {
              color: #fff;
              max-height: 80px;
              font-size: 18px;
              font-weight: 500;
              position: relative;
              text-transform: uppercase;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-bottom: 0px;
              background-color: #000;
              padding: 30px 15px;
              border-bottom: 2px solid #fbfbf1;
            }
            
            .service-image {
              aspect-ratio: 4 / 3;
              width: 100%;
              object-fit: cover;
              display: block;
              transition: all 0.6s;
              transform: scale(1);
            }

         
            .add-cart-button {
              width: 100%;
              background-color: rgb(255, 193, 7);
              border-radius: 0px;
              color: #fff;
                .add-cart-icon {
                font-size: 32px !important;
              }
              &:hover {
                background-color: #fff;
              }
              &:focus {
                outline: none;
              }
            }
            @media screen and (max-width: 769px) {
              .service-image {
                width: 100%
              }
            }
          `}
            </style>
            <div className="item">
                <img className="service-image" src={imgUrl} alt="service" />
                <h3 className="service-title">{title}</h3>
            </div>
        </div>
    );
};

ServiceExItem.propTypes = {
    title: PropTypes.string,
    imgUrl: PropTypes.string,
    onClick: PropTypes.func,
};
