import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './accessDeny.module.scss';
const cx = classNames.bind(styles);
function NotFound() {
    return (
        <section className= {cx('page_404')}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-12 col-sm-offset-1  text-center">
                            <div className= {cx('four_zero_four_bg')}>
                                <h1 className="text-center ">404</h1>
                            </div>

                            <div className={cx('contant_box_404')}>
                                <h3 className="h2">Có vẻ bạn đã bị lạc!</h3>

                                <p>Trang bạn đang tìm kiếm không có sẵn</p>

                                <Link to={'/'}>Trang chủ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NotFound;
