const TAGS = [
  {id: 'all', label: 'All'},
  {id: 'travel', label: 'Travel' },
  {id: 'tech', label: 'Technical'}
];

export default function Tags() {
  return (
    <div className="flex space-x-12">
      {TAGS.map(tag => (
        <button key={tag.id} className="flex items-center justify-center p-4 rounded-full hover:bg-accent">
          {tag.label}
        </button>
      ))}
    </div>
  )
}