import React, { useState } from "react";
import { CustomDropdownOption } from "../../utils/constants.ts";

interface DropdownProps {
  options: CustomDropdownOption[];
  placeholder: string | number;
  label: string;
  onChange: Function;
  classNames?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, placeholder, label, onChange, classNames }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<CustomDropdownOption | null>(null);

  const changeOption = (option: CustomDropdownOption) => {
    setSelectedOption(option);
    onChange(option.value);
  }

  return (
    <div className={classNames ? classNames : "custom-select"} onClick={() => setIsOpen(!isOpen)}>
      <div>{label}</div>
      <span className="text_orange">{selectedOption ? selectedOption.label : placeholder}</span>
      <div className={`arrow ${isOpen ? 'open' : ''}`}></div>
      {isOpen && (
        <div className="options" style={{ display: isOpen ? 'block' : 'none' }}>
          {options.map(option => (
            <div
              key={option.value}
              className="option"
              onClick={() => changeOption(option)}
            >{option.label}</div>
          ))}
        </div>
      )}
    </div >
  );
}
