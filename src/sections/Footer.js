import './styles/footer.css'

export default function Footer() {
    return (
        <div className="section-footer">
            <h2>Earth Roulette by Enrique</h2>
            <div className='footer-elements'>
                <div className='footer-icons'>
                    <h3>Links</h3>
                    <div className='footer-icon'>
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <p>Email</p>
                    </div>
                    <div className='footer-icon'>
                        <i class="devicon-linkedin-plain" aria-hidden="true"></i>
                        <p>Linkedin</p>
                    </div>
                    <div className='footer-icon'>
                        <i class="devicon-github-original" aria-hidden="true"></i>
                        <p>Github</p>
                    </div>
                    <div className='footer-icon'>
                        <i class="fa-solid fa-up-right-from-square"></i>
                        <p>Portfolio</p>
                    </div>
                </div>
                <div className='footer-links'>
                    <h3>Explore</h3>
                    <p>Home</p>
                    <p>Country</p>
                    <p>Map</p>
                    <p>Travelbot</p>
                </div>
            </div>
        </div>
    )
}