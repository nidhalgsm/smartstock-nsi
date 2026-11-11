import unittest
try:
    from app.schemas import DeviceIn
except Exception:
    DeviceIn = None
VALID, BAD = "490154203237518", "490154203237519"


@unittest.skipIf(DeviceIn is None, "pydantic not installed")
class T(unittest.TestCase):
    def test_repair_without_identifiers(self):
        DeviceIn(category="tunisien", is_repair=True, owner_name="Ali")
    def test_normal_phone_needs_identifier(self):
        with self.assertRaises(Exception): DeviceIn(category="tunisien")
    def test_serial_only_ok(self):
        DeviceIn(category="parallele", serial_number="ABC123")
    def test_luhn(self):
        DeviceIn(category="tunisien", imei1=VALID)
        with self.assertRaises(Exception): DeviceIn(category="tunisien", imei1=BAD)
    def test_ram_rom(self):
        DeviceIn(category="tunisien", imei1=VALID, ram=8, rom=512)
        for k, v in (("ram", 5), ("rom", 516)):
            with self.assertRaises(Exception): DeviceIn(category="tunisien", imei1=VALID, **{k: v})
    def test_blank_becomes_none(self):
        d = DeviceIn(category="parallele", imei1=VALID, serial_number="  ", color="")
        self.assertIsNone(d.serial_number); self.assertIsNone(d.color)
    def test_leading_zero_kept(self):
        self.assertEqual(DeviceIn(category="tunisien", serial_number="000123").serial_number, "000123")


if __name__ == "__main__":
    unittest.main()
