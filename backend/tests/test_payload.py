import unittest
from app.payload import drop_repair_columns


class T(unittest.TestCase):
    def test_normal_phone_drops_repair_columns(self):
        d = drop_repair_columns({"model": "A", "is_repair": False, "owner_name": None}, False)
        self.assertEqual(d, {"model": "A"})
    def test_normal_edit_of_normal_phone(self):
        self.assertNotIn("owner_name", drop_repair_columns({"owner_name": None, "is_repair": False}, False, {"is_repair": False}))
    def test_repaired_phone_keeps_columns(self):
        d = drop_repair_columns({"is_repair": True, "owner_name": "Ali"}, True)
        self.assertEqual((d["is_repair"], d["owner_name"]), (True, "Ali"))
    def test_unticking_repaired_must_reset_columns(self):  # was a repaired phone, now a normal one
        d = drop_repair_columns({"is_repair": False, "owner_name": None}, False, {"is_repair": True})
        self.assertEqual((d["is_repair"], d["owner_name"]), (False, None))
    def test_input_not_required_to_have_keys(self):
        self.assertEqual(drop_repair_columns({}, False, None), {})


if __name__ == "__main__":
    unittest.main()
