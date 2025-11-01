import { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function SearchableSelect({ options, value, onChange, placeholder = "Select an option" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        onChange(option);
        setSearchTerm('');
        setIsOpen(false);
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayValue = value || (isOpen ? '' : placeholder);

    return (
        <div className="relative w-full" ref={selectRef}>
            <div className="relative">
                <input
                    type="text"
                    value={isOpen ? searchTerm : value}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-none focus:border-gray-800 focus:border-transparent"
                />
                <FiChevronDown
                    className={`absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {isOpen && (
                <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="px-4 py-3 text-gray-700 cursor-pointer hover:bg-green-50"
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-gray-500">No options found</li>
                    )}
                </ul>
            )}
        </div>
    );
}