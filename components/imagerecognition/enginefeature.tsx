import React from 'react';

interface EngineTypeFeatureProps {
  engineType: string;
}

const EngineTypeFeature: React.FC<EngineTypeFeatureProps> = ({ engineType }) => {
  return (
    <>
      {engineType === 'Twin-Cylinder Diesel Engine' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Proven Lantop Technology</li>
          <li>Proven economy and reliability</li>
          <li>Compact and lightweight</li>
          <li>Fast and easy all-weather starting</li>
          <li>Automatic low oil level cut out</li>
          <li>Heavy-duty air cleaners</li>
          <li>Lower fuel consumption compared to LA engines</li>
        </ol>
      )}
      {engineType === 'Diesel Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>AVR gives stable voltage and safe work</li>
          <li>Circuit breaker protects overload operation</li>
          <li>12.5L tank ensures 8 hours continuous running</li>
          <li>Low oil shutdown stops engine in emergency</li>
          <li>Various sockets for different market</li>
        </ol>
      )}
      {engineType === 'Silent Diesel Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>The lowest noise is 67 dB(A) at 7m</li>
          <li>Minimal vibration & smooth running</li>
          <li>Function better with double large muffler</li>
          <li>Fashion soundproof canopy</li>
          <li>Universal wheels make movement easily</li>
          <li>8 hours continuous running free of fuel plus</li>
        </ol>
      )}
      {engineType === 'Twin-Cylinder Diesel Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Powered by 20hp twin-cylinder diesel engine</li>
          <li>Deluxe style with square frame</li>
          <li>Wheels contribute to easy moving</li>
          <li>Electric start with battery</li>
        </ol>
      )}
      {engineType === 'Diesel Water Pump' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Rational construction</li>
          <li>Strong power and efficient</li>
          <li>Smooth and reliable operation</li>
          <li>Easy to disassemble and maintain</li>
        </ol>
      )}
      {engineType === 'Diesel High Pressure Pump' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Thickening high quality aluminum alloy pump housing</li>
          <li>Enclosed impeller structure with high discharge head, large flow, max lift 75M</li>
          <li>Aluminum three-outlet with multi-option, light portable</li>
          <li>Widely use: high pressure water conveyance, fire fighting</li>
          <li>Long distance water conveyance, hilly irrigation</li>
        </ol>
      )}
      {engineType === 'Diesel Iron Pump' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Cast-iron pump with a closed cast-iron impeller</li>
          <li>Simple in structure, reliable in performance</li>
          <li>Max discharge head: 65M, capacity max 25m³/hr at 40M</li>
          <li>Minimal vibration & smooth running</li>
          <li>CE approved</li>
        </ol>
      )}
      {engineType === 'Gasoline Engine' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Easy starting, smooth running with minimal vibration</li>
          <li>Oil alert built-in</li>
          <li>Compact and lightweight</li>
          <li>Lower fuel consumption</li>
          <li>Excellent durability and reliability</li>
        </ol>
      )}
      {engineType === 'Gasoline Twin-Cylinder Engine' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>V-Two cylinders engine</li>
          <li>Easy starting, smooth running with minimal vibration</li>
          <li>Oil alert built-in</li>
          <li>Lower fuel consumption</li>
          <li>Excellent durability and reliability</li>
        </ol>
      )}
      {engineType === 'Gasoline Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Emergency low oil alert</li>
          <li>Circuit breaker protects overload operation</li>
          <li>Self-excited and voltage-constant with AVR</li>
          <li>Easy starting, smooth running with minimal vibration</li>
          <li>Low noise level & low consumption</li>
          <li>Excellent durability and reliability</li>
        </ol>
      )}
      {engineType === 'Silent Gasoline Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Proven Lantop Technology</li>
          <li>Proven economy and reliability</li>
          <li>Compact and lightweight</li>
          <li>Fast and easy all-weather starting</li>
          <li>Automatic low oil level cut out</li>
          <li>Heavy-duty air cleaners</li>
          <li>Lower fuel consumption compared to LA engines</li>
        </ol>
      )}
      {engineType === 'Twin-Cylinder Gasoline Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Emergency low oil alert</li>
          <li>Circuit breaker protects overload operation</li>
          <li>Self-excited and voltage-constant with AVR</li>
          <li>Easy starting, smooth running with minimal vibration</li>
          <li>Low noise level & low consumption</li>
          <li>Excellent durability and reliability</li>
        </ol>
      )}
      {engineType === 'Liquefied Petroleum Gas & LPT Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Dual-purpose generator with LPG & Petrol engine</li>
          <li>Circuit breaker protects overload operation</li>
          <li>Self-excited and voltage-constant with AVR</li>
          <li>Easy starting, smooth running with minimal vibration</li>
          <li>Low noise level & low consumption</li>
          <li>Excellent durability and reliability</li>
        </ol>
      )}
      {engineType === 'Portable Gasoline Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Portable and lightweight, perfect for BBQ, Camping</li>
          <li>Low noise level & low consumption</li>
          <li>Easy operation and maintenance</li>
          <li>Excellent durability and reliability</li>
        </ol>
      )}
      {engineType === 'Gasoline Water Pump' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Offer the most reliable water removal</li>
          <li>Powerful OHV design for quick and easy priming</li>
          <li>Full frame type, light and compact design make more sturdy and durable</li>
          <li>Durable mechanical seals & cast iron volute & impeller keep running longer and more efficiently</li>
        </ol>
      )}
      {engineType === 'Gasoline Iron Pump' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Offer the most reliable water removal</li>
          <li>Powerful OHV design for quick and easy priming</li>
          <li>Full frame type, light and compact design make more sturdy and durable</li>
          <li>Durable mechanical seals & cast iron volute & impeller keep running longer and more efficiently</li>
        </ol>
      )}
      {engineType === 'Diesel & Gasoline Trash Pump' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Offer the most reliable water removal</li>
          <li>Powerful OHV design for quick and easy priming</li>
          <li>Full frame type, light and compact design make more sturdy and durable</li>
          <li>Durable mechanical seals & cast iron volute & impeller keep running longer and more efficiently</li>
        </ol>
      )}
      {engineType === 'Inverter Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>22% fuel consumption ratio lower, long run time</li>
          <li>57dBA lower noise</li>
          <li>THD 2% available directly to power precision equipment</li>
          <li>Only 22kg compact design</li>
        </ol>
      )}
      {engineType === 'Diesel Welding Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Inductor install to make sure the stable performance</li>
          <li>Support welding rod from 2.0mm-6.0mm</li>
          <li>60% duty cycle</li>
          <li>AVR alternator provides stable voltage and current</li>
          <li>Circuit breaker protects overload operation</li>
        </ol>
      )}
      {engineType === 'Gasoline Welding Generator' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Inductor install to make sure the stable performance</li>
          <li>Support welding rod from 2.0mm-6.0mm</li>
          <li>60% duty cycle</li>
          <li>AVR alternator provides stable voltage and current</li>
          <li>Circuit breaker protects overload operation</li>
        </ol>
      )}
      {engineType === 'Diesel Engine' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Proven Lantop Technology</li>
          <li>Proven economy and reliability</li>
          <li>Compact and lightweight</li>
          <li>Fast and easy all-weather starting</li>
          <li>Automatic low oil level cut out</li>
          <li>Heavy-duty air cleaners</li>
          <li>Lower fuel consumption compared to LA engines</li>
        </ol>
      )}
      {engineType === 'Gasoline High Pressure Pump' && (
        <ol className="pl-5 text-sm list-disc list-inside">
          <li>Offer the most reliable water removal</li>
          <li>Powerful OHV design for quick and easy priming</li>
          <li>Full frame type, light and compact design make more sturdy and durable</li>
          <li>Durable mechanical seals & cast iron volute & impeller keep running longer and more efficiently</li>
        </ol>
      )}
      {!engineType && (
        <div className="text-center font-sans px-8 text-red-950 dark:text-slate-400 text-md">
          No engine type specified.
        </div>
      )}
    </>
  );
};

export default EngineTypeFeature;
