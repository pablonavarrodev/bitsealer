import { useId, useState } from 'react'

export default function TextField({ label, type='text', name, placeholder, autoComplete, required, value, onChange }) {
    const id = useId()
    const [focused, setFocused] = useState(false)
    return (
        <label htmlFor={id} className="block">
        <span className="text-sm font-medium">{label}</span>
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            value={value}
            onChange={onChange}
            onFocus={()=>setFocused(true)}
            onBlur={()=>setFocused(false)}
            className={`mt-1 w-full h-11 px-3 rounded-lg bg-slate-100/80 dark:bg-white/10 border outline-none text-sm
            ${focused ? 'border-[#f7931a] ring-2 ring-[#f7931a]/30' : 'border-white/20 dark:border-white/10'}`}
        />
        </label>
    )
}
