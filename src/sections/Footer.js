import './styles/footer.css'

export default function Footer() {
    return (
        <div className="section-footer">
            <h2>Earth Roulette by Enrique</h2>
            <div className='footer-elements'>
                <div className='footer-icons'>
                    <h3>Links</h3>
                    <a href="mailto:enriquesmith111@gmail.com" target="_blank" className='footer-icon' rel="noreferrer">
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <p>Email</p>
                    </a>
                    <a href="https://www.linkedin.com/in/enrique-smith-dean/" target="_blank" className='footer-icon' rel="noreferrer">
                        <i class="devicon-linkedin-plain" aria-hidden="true"></i>
                        <p>Linkedin</p>
                    </a>
                    <a href="https://github.com/enriquesmith111" target="_blank" className='footer-icon' rel="noreferrer">
                        <i class="devicon-github-original" aria-hidden="true"></i>
                        <p>Github</p>
                    </a>
                    <a href="https://enriquesmith111.github.io/portfolio-v2/" target="_blank" className='footer-icon' rel="noreferrer">
                        <i class="fa-solid fa-up-right-from-square"></i>
                        <p>Portfolio</p>
                    </a>
                </div>
                <div className='footer-links'>
                    <h3>Explore</h3>
                    <p><a href="#home">Home</a></p>
                    <p><a href="#country">Country</a></p>
                    <p><a href="#map">Map</a></p>
                    <p><a href="#travelbot">TravelBot</a></p>
                </div>
            </div>
        </div>
    )
}