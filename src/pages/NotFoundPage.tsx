import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFoundPage() {
  return (
    <EmptyState
      emoji="🫥"
      title="Sayfa bulunamadı"
      description="Aradığın sayfa ocakta unutulmuş olabilir."
      action={<Link to="/" className="btn-primary">Ana sayfaya dön</Link>}
    />
  )
}
