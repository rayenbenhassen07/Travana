import { cities } from "@/data/cities";
import Select from "react-select";

const CountrySelect = ({ value, onChange }) => {
  return (
    <div>
      <Select
        className="z-20"
        placeholder="N'importe où"
        isClearable
        options={cities.map((city) => ({ value: city, label: city }))}
        value={value}
        onChange={(value) => onChange(value)}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg ",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "#40A578",
            primary25: "#BFF6C3",
          },
        })}
      />
    </div>
  );
};

export default CountrySelect;
