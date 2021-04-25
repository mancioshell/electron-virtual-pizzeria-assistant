import { Badge } from 'react-bootstrap'

function Footer() {
  return (
    <footer>
      <p>
        Power by{' '}
        <Badge variant="light">
          <a
            href="https://github.com/mancioshell"
            target="_blank"
            rel="noreferrer">
            mancioshell
          </a>
        </Badge>{' '}
      </p>
    </footer>
  )
}

export { Footer }

export default Footer
