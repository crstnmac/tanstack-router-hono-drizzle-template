import type {FieldApi} from '@tanstack/react-form'

export default function FieldInfo({
  field,
}: Readonly<{
  field: FieldApi<any, any, any, any>
}>) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <div>
          {field.state.meta.errors.map((error, i) => (
            <em className="text-gray-900 bg-red-200 rounded-md px-2 py-1.5 text-sm" key={i}>
              {error}
            </em>
          ))}
        </div>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
